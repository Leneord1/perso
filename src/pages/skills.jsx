import React from "react";
import '../global.css';

function Skills() {
    return (
        <main className="page">
            <h1>Skills</h1>
            <p>Languages and tools with approximate depth of use.</p>
            <div className="skills-tables">
                <table>
                    <thead>
                        <tr>
                            <th>Language</th>
                            <th>Experience</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Java</td>
                            <td>2 years</td>
                        </tr>
                        <tr>
                            <td>JavaScript</td>
                            <td>2 years</td>
                        </tr>
                        <tr>
                            <td>Python</td>
                            <td>1 year</td>
                        </tr>
                        <tr>
                            <td>React</td>
                            <td>2 years</td>
                        </tr>
                        <tr>
                            <td>Node.js</td>
                            <td>1 year</td>
                        </tr>
                        <tr>
                            <td>HTML</td>
                            <td>2 years</td>
                        </tr>
                        <tr>
                            <td>CSS</td>
                            <td>1 year</td>
                        </tr>
                        <tr>
                            <td>SQL</td>
                            <td>1 year</td>
                        </tr>
                        <tr>
                            <td>Docker</td>
                            <td>8 months</td>
                        </tr>
                    </tbody>
                </table>

                <table>
                    <thead>
                        <tr>
                            <th>Tools</th>
                            <th>Experience</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>GitHub & Git</td>
                            <td>4 years</td>
                        </tr>
                        <tr>
                            <td>JetBrains IDEs</td>
                            <td>3 years</td>
                        </tr>
                        <tr>
                            <td>Microsoft Office</td>
                            <td>10 years</td>
                        </tr>
                        <tr>
                            <td>CI/CD pipelines</td>
                            <td>2 years</td>
                        </tr>
                        <tr>
                            <td>Bash</td>
                            <td>2 years</td>
                        </tr>
                        <tr>
                            <td>Trello</td>
                            <td>1 year</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    );
}

export default Skills;
