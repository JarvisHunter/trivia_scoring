import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./style/login.css";
import { InputBox } from "../components/input_box";
import { Button } from "../components/button";
import ArrowRightIcon from "../assets/arrow-right.png";
import removeVietnameseTones from "../helper/removeVN";
import { fetchData } from "../helper/handleData.js";

const LoginPage = () => {
	const history = useHistory();

	const handleLogin = async () => {
		const nameInput = document.getElementById("uid");
		const name = nameInput.value;
		if (name === "") {
			alert("Please enter a valid team name");
			return;
		}
		const uid = removeVietnameseTones(name)
			.toLowerCase()
			.replaceAll(" ", "_");

		fetchData("login", "PUT", { teamID: uid }, () => {
			localStorage.setItem("team", uid);
			history.push("/game");
		});
	};

	useEffect(() => {
		if (localStorage.getItem("team")) {
			history.push("/game");
		}
	}, [history]);

	return (
		<div className="login-container">
			<p className="title">
				<span>Trivia</span>
				<span>Scoring</span>
			</p>
			<div className="form">
				<InputBox
					id="uid"
					placeHolder="Enter team name here"
					title="Team name"
				/>
			</div>
			<Button
				text="Login"
				icon={ArrowRightIcon}
				onClick={handleLogin}
			></Button>
		</div>
	);
};

export default LoginPage;
