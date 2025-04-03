import RowScoreboard from "./row_scoreboard.jsx";
import "../pages/style/scoreboard.css";

function Table({ teams, currentQuestion }) {
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
				{teams.map((team, index) => (
					<RowScoreboard
						key={index}
						index={index + 1}
						name={team.name}
						correct={team.correctAnswers}
						total={currentQuestion}
						score={team.credit}
					/>
				))}
			</tbody>
		</table>
	);
}

export default Table;
