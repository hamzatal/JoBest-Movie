<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\ChatGPTServices;

class ChatBotController extends Controller
{
    protected $chatGPTService;

    public function __construct(ChatGPTServices $chatGPTService)
    {
        $this->chatGPTService = $chatGPTService;
    }

    // Render the chatbot page
    public function index()
    {
        return Inertia::render('Chatbot');
    }

    // Handle chatbot request
    public function chatbot(Request $request)
    {
        $message = $request->input('message');

        if (!$message) {
            return response()->json(['error' => 'Message is required'], 400);
        }

        $result = $this->chatGPTService->analyzeSceneDescription($message);

        if ($result['status'] === 'success') {
            return response()->json([
                'response' => $result['response'],
                'language' => $result['language'],
            ]);
        }

        return response()->json([
            'error' => $result['message'] ?? 'An error occurred.',
            'details' => $result['error'] ?? null,
        ], 500);
    }
}
