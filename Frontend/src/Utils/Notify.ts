import { Notyf } from "notyf"; // npm i notyf

class Notify {

    private notyf = new Notyf({
        position: { x: "left", y: "top" },
        duration: 3500,
        dismissible: true,
        ripple: true,
        types: [
            {
                type: "success",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                icon: {
                    className: "notyf__icon--success",
                    tagName: "span",
                    color: "#ffffff"
                }
            },
            {
                type: "error",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                icon: {
                    className: "notyf__icon--error",
                    tagName: "span",
                    color: "#ffffff"
                }
            }
        ]
    });

    public success(message: string): void {
        this.notyf.success(message);
    }

    public error(err: any): void {
        const message = this.extractErrorMessage(err);
        this.notyf.error(message);
    }

    private extractErrorMessage(err: any): string {
        if(typeof err === "string") return err; // String error.
        if(typeof err?.response?.data === "string") return err.response.data; // Axios error
        if(typeof err?.response?.data?.message === "string") return err.response.data.message;
        if(typeof err?.message === "string") return err.message; // throw new Error("...")
        return "Some error, please try again.";
    }

}

export const notify = new Notify();
