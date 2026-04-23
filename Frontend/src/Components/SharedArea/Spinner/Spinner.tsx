import "./Spinner.css";
import imageSource from "../../../assets/loading.gif";

export function Spinner() {
    return (
        <div className="Spinner">

            <img src={imageSource} />

        </div>
    );
}
