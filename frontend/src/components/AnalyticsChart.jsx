function AnalyticsChart({ entries }) {
    const projectTotals = {};

    entries.forEach((entry) => {
        if (!projectTotals[entry.project_name]) {
            projectTotals[entry.project_name] = 0;
        }

        projectTotals[entry.project_name] += entry.duration;
    });

    const projects = Object.entries(projectTotals);

    if (projects.length === 0) {
        return null;
    }

    const maxDuration = Math.max(
        ...projects.map(([, duration]) => duration)
    );

    return (
        <div className="analytics-chart">
            <h2>Время по проектам</h2>

            {projects.map(([name, duration]) => {
                const width =
                    maxDuration === 0
                        ? 0
                        : (duration / maxDuration) * 100;

                return (
                    <div
                        className="analytics-chart__item"
                        key={name}
                    >
                        <div>
                            {name} — {duration} сек.
                        </div>

                        <div className="analytics-chart__background">
                            <div
                                className="analytics-chart__bar"
                                style={{
                                    width: `${width}%`
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default AnalyticsChart;