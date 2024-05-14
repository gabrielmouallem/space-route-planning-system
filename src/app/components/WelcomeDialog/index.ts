import { WelcomeDialog } from "./WelcomeDialog";
import dynamic from "next/dynamic";

export default dynamic(() => Promise.resolve(WelcomeDialog), { ssr: false });
