<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Services\GeminiChatService;

class ChatBotController extends Controller
{
    protected $geminiChatService;

    public function __construct(GeminiChatService $geminiChatService)
    {
        $this->geminiChatService = $geminiChatService;
    }

    // Render ChatBot page
    public function index()
    {
        return Inertia::render('Chatbot');
    }

    // Handle chat request
    public function chatbot(Request $request)
    {
        $message = $request->input('message');

        if (!$message) {
            return response()->json(['error' => 'Message is required'], 400);
        }

        $response = $this->geminiChatService->askGemini($message);

        return response()->json(['response' => $response]);
    }
}