import "./style/table_scoreboard.css";
import { useState, useEffect } from "react";

function Table({ teams, currentQuestion }) {
	const [sortedTeams, setSortedTeams] = useState([...teams]);

	useEffect(() => {
		const newSortedTeams = [...teams].sort((a, b) => b.credit - a.credit);
		setSortedTeams(newSortedTeams);
	}, [teams]);

	return (
		<table className="scoreboard-table">
			<thead>
				<tr className="header-row">
					<th className="rank-header">RANK</th>
					<th className="team-header">TEAM NAME</th>
					<th className="answer-header">CORRECT ANSWER</th>
					<th className="score-header">SCORE</th>
				</tr>
			</thead>
			<tbody>
				{sortedTeams.map((team, index) => (
					<tr key={index} className="team-row">
						<td className="rank-cell">{index + 1}</td>
						<td className="team-cell">{team.name}</td>
						<td className="answer-cell">
							{team.correctAnswers || 0}/{currentQuestion}
						</td>
						<td className="score-cell animate-score">
							{team.credit}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

export default Table;
