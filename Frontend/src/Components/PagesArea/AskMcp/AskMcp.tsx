import "./AskMcp.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "../../SharedArea/Spinner/Spinner";
import { notify } from "../../../Utils/Notify";
import { AppState } from "../../../Redux/AppState";
import { gptService } from "../../../Services/GptService";

export function AskMcp() {

    const navigate = useNavigate();
    const user = useSelector((state: AppState) => state.user);

    const [prompt, setPrompt] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);

    const suggestions = [
        "How many active vacations are there?",
        "What is the average vacation price?",
        "Show me upcoming vacations in Europe",
        "Which vacations have the most likes?",
        "How many vacations start this month?"
    ];

    useEffect(() => {
        if (!user) {
            notify.error("Please login first");
            navigate("/login");
        }
    }, [user, navigate]);

    function selectSuggestion(text: string) {
        setPrompt(text);
        setShowSuggestions(false);
        setActiveIndex(-1);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!showSuggestions) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex(prev => prev < suggestions.length - 1 ? prev + 1 : 0);
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex(prev => prev > 0 ? prev - 1 : suggestions.length - 1);
        }

        if (e.key === "Enter") {
            e.preventDefault();
            if (activeIndex >= 0) {
                selectSuggestion(suggestions[activeIndex]);
            }
            else {
                sendQuestion();
            }
        }
    }

    async function sendQuestion() {
        if (!prompt.trim() || isLoading) return;

        try {
            setIsLoading(true);
            setAnswer("");
            const response = await gptService.getMcpAnswer(prompt);
            setAnswer(response);
            setPrompt("");
        }
        catch (err: any) {
            notify.error(err?.message || "Failed to get answer");
        }
        finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="AskAI" style={{ position: "relative" }}>
            <h2>📊 Ask About Vacations</h2>

            <div className="ai-input-area">
                <input
                    type="text"
                    placeholder="Ask anything about our vacations..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => {
                        setShowSuggestions(false);
                        setActiveIndex(-1);
                    }, 150)}
                    onKeyDown={handleKeyDown} />

                <button
                    onClick={sendQuestion}
                    disabled={isLoading || prompt.length < 3}>
                    {isLoading ? (
                        <span className="btn-loading">
                            <Spinner />
                            Asking...
                        </span>) : ("Ask")}
                </button>

                {showSuggestions && (
                    <div className="suggestions-box">
                        {suggestions.map((s, index) => (
                            <div
                                key={index}
                                className={`suggestion-item ${index === activeIndex ? "active" : ""}`}
                                onMouseDown={() => selectSuggestion(s)}
                                onMouseEnter={() => setActiveIndex(index)}>
                                {s}
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {isLoading && <Spinner />}

            {answer && (
                <div className="ai-response">
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
}