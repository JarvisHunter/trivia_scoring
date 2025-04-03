import React, { useState, useEffect } from "react";
import { useCallback } from "react";
import { Answer } from "../components/radio_answer";
import { fetchData } from "../helper/handleData";

function QuestionPage({
	teamId,
	currentQuestion,
	currentDuration,
	teamName,
	numQuestions,
	setAnswerSubmitted,
}) {
	const [selectedAnswer, setSelectedAnswer] = useState("E");
	const [timeLeft, setTimeLeft] = useState(currentDuration);

	useEffect(() => {
		setTimeLeft(currentDuration);
	}, [currentDuration]);

	const handleAnswer = useCallback(async () => {
		await fetchData(
			"answerQuestion",
			"POST",
			{
				teamId,
				answer: selectedAnswer,
			},
			_ => {
				setAnswerSubmitted(true);
				console.log("Answer submitted:", selectedAnswer);
			}
		);
	}, [teamId, selectedAnswer, setAnswerSubmitted]);

	useEffect(() => {
		if (timeLeft <= 0) {
			handleAnswer();
			return;
		}
		const timerId = setInterval(() => {
			setTimeLeft(prev => prev - 1);
		}, 1000);
		return () => clearInterval(timerId);
	}, [timeLeft, handleAnswer]);

	const updateAnswer = value => {
		setSelectedAnswer(value);
	};

	return (
		<>
			<div className="team-info">
				<div className="team-name">{teamName}</div>
				<div className="question-counter-container">
					<div className="question">Question:</div>
					<div className="question-number">
						{currentQuestion}/{numQuestions}
					</div>
				</div>
			</div>
			<div className="timer">{timeLeft}</div>
			<div className="question-container">
				<div className="question-text">
					What answer did the team choose?
				</div>
				<div className="answers">
					<div className="answer-row">
						<Answer
							id="choiceA"
							value="A"
							onClick={() => updateAnswer("A")}
						/>
						<Answer
							id="choiceB"
							value="B"
							onClick={() => updateAnswer("B")}
						/>
					</div>
					<div className="answer-row">
						<Answer
							id="choiceC"
							value="C"
							onClick={() => updateAnswer("C")}
						/>
						<Answer
							id="choiceD"
							value="D"
							onClick={() => updateAnswer("D")}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

export default QuestionPage;
