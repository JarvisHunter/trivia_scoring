import React, { useEffect, useState } from "react";
import "./style/scoreboard.css";
import Loading from "../components/loading";
import logo from "../assets/stem_club_logo.png";
import { GAME_STATUS } from "../constants/gameStatus.js";
import Table from "../components/table_scoreboard";
import { socket } from "../socket.js";
import { fetchData } from "../helper/handleData.js";

function Scoreboard() {
	const [questionDurations, setQuestionDurations] = useState([]);
	const [gameID, setGameID] = useState();
	const [gameStatus, setGameStatus] = useState();
	const [currentQuestion, setCurrentQuestion] = useState(1);
	const [teamsInfo, setTeamsInfo] = useState([]);
	const [timeLeft, setTimeLeft] = React.useState(null);

	useEffect(() => {
		function onGameDataEvent(newData) {
			setGameID(newData.gameID);
			setGameStatus(newData.status);
			setCurrentQuestion(newData.current_index);
		}

		socket.connect();
		socket.on("gameData", onGameDataEvent);

		return () => {
			socket.off("gameData", onGameDataEvent);
			socket.disconnect();
		};
	}, []);

	useEffect(() => {
		if (
			gameStatus !== GAME_STATUS.NOT_STARTED &&
			gameStatus !== GAME_STATUS.SUMMARIZED
		)
			return;

		fetchData(
			"teams",
			undefined,
			undefined,
			data => setTeamsInfo(data.teams),
			false
		);
	}, [gameStatus]);

	useEffect(() => {
		fetchData("allQuestionDurations", undefined, undefined, data =>
			setQuestionDurations(data.durations)
		);
	}, [gameID]);

	useEffect(() => {
		if (gameStatus === GAME_STATUS.IN_PROGRESS) {
			const currentDuration =
				questionDurations?.find(item => item.index === currentQuestion)
					?.duration || 30;
			setTimeLeft(currentDuration);
		}
	}, [gameStatus, currentQuestion, questionDurations]);

	useEffect(() => {
		if (gameStatus !== GAME_STATUS.IN_PROGRESS) return;

		const timerId = setInterval(() => {
			setTimeLeft(time => {
				if (time === 0) {
					clearInterval(timerId);
					return 0;
				} else return time - 1;
			});
		}, 1000);
		return () => clearInterval(timerId);
		//eslint-disable-next-line
	}, [gameStatus]);

	return (
		<div className="scoreboard-container">
			<div className="timer-container">
				<img src={logo} alt="Logo" className="logo" />
				{gameStatus === GAME_STATUS.IN_PROGRESS && (
					<span className="scoreboard-timer">{timeLeft}</span>
				)}
			</div>
			<div className="scoreboard-title-container">
				<span className="scoreboard-title">SCOREBOARD</span>
			</div>
			{questionDurations === 0 || !gameStatus ? (
				<Loading msg="Loading scoreboard..." />
			) : gameStatus === GAME_STATUS.NOT_INITIALIZE || !teamsInfo ? (
				<Loading msg="Waiting for host to initialize the game..." />
			) : (
				<div className="scoreboard-table-container">
					<Table
						teams={teamsInfo}
						currentQuestion={currentQuestion}
					></Table>
				</div>
			)}
		</div>
	);
}

export default Scoreboard;
