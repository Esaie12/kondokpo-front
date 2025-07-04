import { getProgressPercentage, getStrokeOffset, PROGRESS_CIRCUMFERENCE, PROGRESS_RADIUS } from "../../utils/functions";

type ProgressCircleProps = {
    collected: number;
    goal: number;
};

const ProgressCircle = ({ collected, goal }: ProgressCircleProps) => {
    const percentage = getProgressPercentage(collected, goal);
    const offset = getStrokeOffset(percentage);

    return (
        <div className="progress-section">
            <div className="progress-circle">
                <svg className="progress-ring" viewBox="0 0 160 160">
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{ stopColor: "#ff9a9e" }} />
                            <stop offset="100%" style={{ stopColor: "#a8e6cf" }} />
                        </linearGradient>
                    </defs>
                    <circle
                        className="progress-ring-bg"
                        cx="80"
                        cy="80"
                        r={PROGRESS_RADIUS}
                        stroke="#eee"
                        strokeWidth="15"
                        fill="none"
                    />
                    <circle
                        className="progress-ring-fill"
                        cx="80"
                        cy="80"
                        r={PROGRESS_RADIUS}
                        stroke="url(#gradient)"
                        strokeWidth="15"
                        fill="none"
                        strokeDasharray={PROGRESS_CIRCUMFERENCE}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        transform="rotate(-90 80 80)"
                    />
                </svg>
                <div className="progress-text">
                    <span className="progress-percentage">{percentage}%</span>
                    <span className="progress-label">Objectif atteint</span>
                </div>
            </div>
        </div>
    );
};

export default ProgressCircle;