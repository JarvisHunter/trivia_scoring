import React, { useState, useEffect } from "react";
import BettingPage from "./betting";
import QuestionPage from "./question";
import Loading from "../components/loading";
import "./style/team.css";
import { Button } from "../components/button";
import { useHistory } from "react-router-dom";
import LogOutIcon from "../assets/logout.png";
import { socket } from "../socket.js";
import { GAME_STATUS } from "../constants/gameStatus.js";
import { fetchData } from "../helper/handleData.js";

function Game() {
	const [gameStatus, setGameStatus] = useState();
	const [currentQuestionIndex, setCurrentQuestion] = useState(1);
	const [currentDuration, setCurrentDuration] = useState();
	const [questionDurations, setQuestionDurations] = useState([]);

	const teamId = localStorage.getItem("team");
	const history = useHistory();
	const [teamName, setTeamName] = useState();
	const [currentCredit, setCurrentCredit] = useState(0);
	const [betSubmitted, setBetSubmitted] = useState(false);
	const [answerSubmitted, setAnswerSubmitted] = useState(false);
	const [gameID, setGameID] = useState();

	useEffect(() => {
		function onGameDataEvent(newData) {
			console.log("Received game data:", newData);
			setGameID(newData.gameID);
			setGameStatus(newData.status);
			if (newData.current_index !== currentQuestionIndex) {
				setBetSubmitted(false);
				setCurrentQuestion(newData.current_index);
			}
		}

		socket.connect();
		socket.on("gameData", onGameDataEvent);

		return () => {
			socket.off("gameData", onGameDataEvent);
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		fetchData("teamName", "POST", { teamID: teamId }, data => {
			setTeamName(data.name);
		});
	}, [teamId]);

	useEffect(() => {
		if (
			!gameStatus ||
			(gameStatus !== GAME_STATUS.NOT_STARTED &&
				gameStatus !== GAME_STATUS.SUMMARIZED)
		)
			return;

		if (!gameID) return;

		fetchData("teamCredit", "POST", { teamID: teamId }, data => {
			setCurrentCredit(data.credit);
		});
	}, [gameStatus, teamId, gameID]);

	useEffect(() => {
		if (!gameID) return;

		fetchData("allQuestionDurations", undefined, undefined, data =>
			setQuestionDurations(data.durations)
		);
	}, [gameID]);

	useEffect(() => {
		if (
			gameStatus === GAME_STATUS.NOT_INITIALIZE ||
			gameStatus === GAME_STATUS.SUMMARIZED
		) {
			setBetSubmitted(false);
			setAnswerSubmitted(false);
		}
	}, [gameStatus]);

	useEffect(() => {
		if (gameStatus === GAME_STATUS.NOT_STARTED) {
			const newDuration = questionDurations.find(
				item => item.index === currentQuestionIndex
			)?.duration;
			setCurrentDuration(newDuration);
		}
	}, [gameStatus, questionDurations, currentQuestionIndex]);

	const handleLogOut = async () => {
		fetchData("logout", "PUT", { teamID: teamId }, _ => {
			localStorage.removeItem("team");
			history.push("/");
		});
	};

	if (!teamId) {
		history.push("/");
	}

	if (!gameID || gameStatus === GAME_STATUS.NOT_INITIALIZE) {
		return (
			<div className="team-container">
				<Loading msg="Waiting for host to initialize the game..." />
				<Button
					id="logout"
					type="destructive"
					icon={LogOutIcon}
					text="Logout"
					onClick={handleLogOut}
				/>
			</div>
		);
	}

	if (
		questionDurations?.length === 0 ||
		!gameStatus ||
		!teamName ||
		!currentCredit
	) {
		return (
			<div className="team-container">
				<Loading msg="Loading..." />
			</div>
		);
	}

	if (betSubmitted && gameStatus === GAME_STATUS.NOT_STARTED) {
		return (
			<div className="team-container">
				<Loading msg="Waiting for host to start the question..." />
			</div>
		);
	}

	if (answerSubmitted && gameStatus === GAME_STATUS.FINISHED) {
		return (
			<div className="team-container">
				<Loading msg="Waiting for host to tally up the score..." />
			</div>
		);
	}

	if (gameStatus === GAME_STATUS.SUMMARIZED) {
		return (
			<div className="team-container">
				<Loading msg="Waiting for next question..." />
				<Button
					id="logout"
					type="destructive"
					icon={LogOutIcon}
					text="Logout"
					onClick={handleLogOut}
				/>
			</div>
		);
	}

	if (gameStatus === GAME_STATUS.NOT_STARTED) {
		return (
			<div className="team-container">
				<BettingPage
					currentQuestion={currentQuestionIndex}
					numQuestions={questionDurations.length}
					teamInfo={{
						teamId: teamId,
						name: teamName,
						credit: currentCredit,
					}}
					setBetSubmitted={setBetSubmitted}
				/>
			</div>
		);
	}

	if (
		gameStatus === GAME_STATUS.IN_PROGRESS ||
		(gameStatus === GAME_STATUS.FINISHED && !answerSubmitted)
	) {
		return (
			<div className="team-container">
				<QuestionPage
					teamId={teamId}
					currentQuestion={currentQuestionIndex}
					currentDuration={currentDuration}
					numQuestions={questionDurations.length}
					setAnswerSubmitted={setAnswerSubmitted}
				/>
			</div>
		);
	}

	if (currentQuestionIndex === questionDurations.length) {
		return history.push("/game_over");
	}

	return (
		<div className="team-container">
			<Loading msg="Something went wrong! Please wait..." />
		</div>
	);
}

export default Game;
