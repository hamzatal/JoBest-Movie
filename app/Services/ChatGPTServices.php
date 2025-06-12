<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;

class ChatGPTServices
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->client = new Client();
        $this->apiKey = env('OPENAI_API_KEY');
    }

    public function analyzeSceneDescription(string $description): array
    {
        try {
            // تحديد اللغة تلقائيًا
            $lang = $this->isArabic($description) ? 'Arabic' : 'English';

            // بناء البرومبت المناسب للغة
            $prompt = $this->buildPrompt($description, $lang);

            $response = $this->client->post('https://api.openai.com/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => 'gpt-4',
                    'messages' => [
                        ['role' => 'system', 'content' => "You are a helpful movie expert assistant. Reply in $lang only."],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    'max_tokens' => 500,
                    'temperature' => 0.7,
                ],
            ]);

            $body = json_decode($response->getBody()->getContents(), true);
            return [
                'status' => 'success',
                'language' => $lang,
                'response' => $body['choices'][0]['message']['content'] ?? 'No response.',
            ];

        } catch (RequestException $e) {
            return [
                'status' => 'error',
                'message' => 'Connection failed to ChatGPT.',
                'error' => $e->getMessage()
            ];
        } catch (\Exception $e) {
            return [
                'status' => 'error',
                'message' => 'Unexpected error.',
                'error' => $e->getMessage()
            ];
        }
    }

    private function buildPrompt(string $description, string $lang): string
    {
        return <<<EOT
You are an expert in movies and film recommendations. A user described a scene from a movie.

Your tasks:
1. Identify the most likely movie.
2. Show the movie title in **both English and Arabic** like this: 🎬 اسم الفيلم: [العربية] ([English])
3. Write a clear and cinematic summary of the movie in Arabic.
4. Insert a separator line: "---".
5. Suggest 5 similar movies: Write their **Arabic title**, and put the **English title in parentheses** next to each.

Format your reply like this:

🎬 اسم الفيلم: الاسم بالعربية (English Title)  
📝 ملخص الفيلم:  
[اكتب هنا ملخصًا موجزًا وجذابًا]

---
🎥 أفلام مشابهة:
1. اسم بالعربية (English Title)
2. ...
3. ...
4. ...
5. ...

وصف المستخدم للمشهد: "$description"
EOT;
    }


    private function isArabic($text): bool
    {
        return preg_match('/\p{Arabic}/u', $text);
    }
}
