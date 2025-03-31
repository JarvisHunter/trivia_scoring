import React, { useState } from "react";
import { InputBox } from "../components/input_box";
import { Button } from "../components/button";
import CheckIcon from "../assets/check.png";
import { fetchData } from "../helper/handleData.js";

const BettingPage = ({
	currentQuestion,
	numQuestions,
	teamInfo,
	setBetSubmitted,
}) => {
	const [bet, setBet] = useState("");

	const handleBet = async e => {
		e.preventDefault();
		const betValue = parseInt(bet, 10);

		fetchData(
			"bet",
			"POST",
			{ teamID: teamInfo.teamId, bet: betValue },
			_ => setBetSubmitted(true)
		);
	};

	return (
		<div className="submit-button-container">
			<div className="question-counter-container">
				<div className="question">Question:</div>
				<div className="question-number">
					{currentQuestion}/{numQuestions}
				</div>
			</div>
			<div className="team-info-container">
				<div className="info-container">
					<div className="team-label">Team:</div>
					<div className="team-name">{teamInfo.name}</div>
				</div>
				<div className="info-container">
					<div className="team-label">Credits:</div>
					<div className="team-value">{teamInfo.credit}</div>
				</div>
			</div>
			<InputBox
				id="betInput"
				title="Bet EC"
				placeHolder="Enter bet EC here..."
				type="number"
				value={bet}
				onChange={e => setBet(e.target.value)}
			/>
			<Button
				text="Submit"
				icon={CheckIcon}
				inputType="submit"
				onClick={handleBet}
			/>
		</div>
	);
};

export default BettingPage;
