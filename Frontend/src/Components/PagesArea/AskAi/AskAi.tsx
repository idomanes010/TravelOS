import "./AskAi.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/AppState";
import { notify } from "../../../Utils/Notify";
import { gptService } from "../../../Services/GptService";
import { Spinner } from "../../SharedArea/Spinner/Spinner";


export function AskAi() {

    const navigate = useNavigate();
    const user = useSelector((state: AppState) => state.user);

    const [prompt, setPrompt] = useState<string>("");
    const [answer, setAnswer] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    const suggestions = [
        "Best sunny destinations in Spain",
        "Cheap vacation in Thailand for 7 days",
        "Romantic trip ideas in France",
        "Family friendly beach vacations in Mexico",
        "Adventure travel in Peru"
    ];

    useEffect(() => {
        if (!user) {
            notify.error("Please login to use AI features.");
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
            setActiveIndex((prev) =>
                prev < suggestions.length - 1 ? prev + 1 : 0
            );
        }

        if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((prev) =>
                prev > 0 ? prev - 1 : suggestions.length - 1
            );
        }

        if (e.key === "Enter") {
            e.preventDefault();

            if (activeIndex >= 0) {
                selectSuggestion(suggestions[activeIndex]);
            } else {
                sendChat();
            }
        }
    }

    async function sendChat() {
        if (!prompt.trim()) return;

        try {
            setIsLoading(true);
            setAnswer("");

            const response = await gptService.getGptAnswer(prompt);

            setAnswer(response);
            setPrompt("");

        } catch (err: any) {
            notify.error(err?.message || "Failed to get AI response");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="AskAI" style={{ position: "relative" }}>
            <h2>Ai Recommendation</h2>

            <div className="ai-input-area">

                <input
                    type="text"
                    placeholder="Ask for travel ideas..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => {
                        setShowSuggestions(false);
                        setActiveIndex(-1);
                    }, 150)}
                    onKeyDown={handleKeyDown}
                />

                <button onClick={sendChat} disabled={isLoading || !prompt.trim()}>
                    {isLoading ? (
                        <span className="btn-loading">
                            <Spinner /> Loading...
                        </span>
                    ) : (
                        "Get Recommendation"
                    )}
                </button>

                {showSuggestions && (
                    <div className="suggestions-box">

                        {suggestions.map((s, index) => (
                            <div
                                key={index}
                                className={`suggestion-item ${index === activeIndex ? "active" : ""
                                    }`}
                                onMouseDown={() => selectSuggestion(s)}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
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