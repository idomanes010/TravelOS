import "./VacationReport.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { notify } from "../../../Utils/Notify";
import { Role } from "../../../Models/RoleModel";
import { AppState } from "../../../Redux/AppState";
import { vacationService } from "../../../Services/VacationService";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer
} from "recharts";

interface ReportRow {
    destination: string;
    likesCount: number;
}

export function VacationReport() {

    const user = useSelector((state: AppState) => state.user);
    const navigate = useNavigate();

    const [data, setData] = useState<ReportRow[]>([]);
    const [loading, setLoading] = useState(true);

    function shortenDestination(destination: string): string {
        if (destination.length <= 12) return destination;
        return destination.slice(0, 12) + "...";
    }

    useEffect(() => {

        if (!user || user.role !== Role.Admin) {
            notify.error("Only admins can access this page.");
            navigate("/vacations");
            return;
        }

        vacationService.getVacationReport()
            .then(setData)
            .catch(err => notify.error(err.message || "Error loading report"))
            .finally(() => setLoading(false));

    }, [user, navigate]);

    // CSV download
    async function downloadCsv() {
        try {
            const csv = await vacationService.getVacationReportCsv();

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = "vacation-report.csv";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err: any) {
            notify.error(err.message || "Error downloading CSV");
        }
    }

    return (
        <div className="VacationReport">

            <h2>Vacation Likes Report</h2>

            {user?.role === Role.Admin && (
                <button onClick={downloadCsv}>
                    ⬇ Download CSV
                </button>
            )}

            {loading && <p>Loading...</p>}

            {!loading && data.length === 0 && (
                <p>No data available.</p>
            )}

            {!loading && data.length > 0 && (
                <div style={{ width: "100%", height: 420 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={data}
                            margin={{ top: 12, right: 24, left: 0, bottom: 70 }}
                        >

                            <CartesianGrid strokeDasharray="3 3" />

                            <XAxis
                                dataKey="destination"
                                interval={0}
                                tick={{ fontSize: 12 }}
                                tickFormatter={shortenDestination}
                                angle={-25}
                                textAnchor="end"
                                height={70}
                            />

                            <YAxis allowDecimals={false} />

                            <Tooltip
                                formatter={(value: any) => [value, "Likes"]}
                                labelFormatter={(label: any) => `Destination: ${String(label)}`}
                            />

                            <Bar dataKey="likesCount" fill="#4f46e5" />

                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

        </div>
    );
}












































