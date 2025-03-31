import React, { useState, useEffect } from "react";
import { Answer } from "../components/radio_answer";
import { fetchData } from "../helper/handleData";

function QuestionPage({
	teamId,
	currentQuestion,
	currentDuration,
	teamName,
	numQuestions,
}) {
	const [selectedAnswer, setSelectedAnswer] = useState("E");
	const [timeLeft, setTimeLeft] = useState(currentDuration);

	useEffect(() => {
		setTimeLeft(currentDuration);
	}, [currentDuration]);

	useEffect(() => {
		if (timeLeft <= 0) return;
		const timerId = setInterval(() => {
			setTimeLeft(prev => prev - 1);
		}, 1000);
		return () => clearInterval(timerId);
	}, [timeLeft]);

	useEffect(() => {
		if (timeLeft <= 0) {
			handleSubmit(null, true);
		}
	});

	const updateAnswer = value => {
		setSelectedAnswer(value);
	};

	const handleSubmit = async (e, auto = false) => {
		if (e && e.preventDefault) e.preventDefault();
		if (selectedAnswer === "E" && !auto) {
			alert("Please select an answer");
			return;
		}

		fetchData(
			"answerQuestion",
			"POST",
			{ teamId, answer: selectedAnswer },
			data => {
				console.log("Answer submitted:", data);
			}
		);
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
