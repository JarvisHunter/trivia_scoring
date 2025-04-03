import React from "react";
import "./style/row_scoreboard.css";

function RowScoreboard({ index, name, correct, total, score }) {
	return (
		<tr key={index} className="team-row">
			<td className="rank-cell">{index}</td>
			<td className="team-cell">{name}</td>
			<td className="answer-cell">
				{correct || 0}/{total}
			</td>
			<td className="score-cell">{score}</td>
		</tr>
	);
}

export default RowScoreboard;
