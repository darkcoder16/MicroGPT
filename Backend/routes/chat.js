import express from "express";
import Thread from "../models/Thread.js";
import getOpenAiApiResponse from "../utils/openAi.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

//test
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "tyui",
            title: "Testing New Thread 1"
        });

        const response = await thread.save();
        res.send(response);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to save in database" });
    }
});

//to get all threads
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        //sorting of threads = in descendign order to get the most recent data at top
        res.json(threads);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to save in database" });
    }
});

//to get the thread with thread ID
router.get("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;

    try {
        const thread = await Thread.findOne({ threadId });

        if (!thread) {
            return res.status(404).json({ error: "thread not found" });
        }
        res.json(thread.messages || []);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to fetch chat" });
    }
})

//to delete a thread
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const deletedThread = await Thread.findOneAndDelete({ threadId });

        if (!deletedThread) {
            return res.status(404).json({ error: "thread not found" });
        }

        res.status(200).json({ success: "thread deleted successfully !" });
        console.log(deletedThread);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "failed to delete chat" });
    }
});

//chat route 
router.post("/chat", authMiddleware, async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
        return res.status(400).json({ error: "missing required fields" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            //crete a new thread in DB
            thread = new Thread({
                threadId,
                title: message,
                messages: [{ role: "user", content: message }]
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getOpenAiApiResponse(message);

        if (!assistantReply) {
            console.log("❌ AI reply is undefined");
            return res.status(500).json({ error: "AI response failed" });
        }

        console.log("✅ AI Reply:", assistantReply);

        thread.messages.push({
            role: "assistant",
            content: assistantReply
        });

        thread.updatedAt = new Date();

        await thread.save();

        res.json({ reply: assistantReply });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "something went wrong !" });
    }
});

export default router;