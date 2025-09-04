import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import PerijoveSelector from "./PerijoveSelector";
import Nav from "./Nav";
import Perijove from "./Perijove/Perijove";
import Vortex from "./Vortex";
import Explorer from "./Explorer/Explorer";
import Subject from "./Subject/Subject";

function PerijoveApp() {
    const params = useParams();
    return <Perijove perijove={Number(params.perijove_id)} />;
}

function VortexApp() {
    const params = useParams();
    if (!params.vortex_id) return;
    return <Vortex vortex_id={params.vortex_id} />;
}

function SubjectApp() {
    const params = useParams();
    if (!params.subject_id) return;
    return <Subject subject_id={params.subject_id} />;
}

const basename = process.env.NODE_ENV === "development" ? "/" : "/jvhexplorer";

const rootElement = document.getElementById("root");

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <article id="main" className="container box-border mx-auto">
                <BrowserRouter basename={basename}>
                    <Nav />
                    <Routes>
                        <Route path="/" element={<PerijoveSelector />} />
                        <Route path="/explore" element={<Explorer />} />
                        <Route
                            path="/perijove/:perijove_id/"
                            element={<PerijoveApp />}
                        />
                        <Route
                            path="/vortex/:vortex_id/"
                            element={<VortexApp />}
                        />
                        <Route
                            path="/subject/:subject_id/"
                            element={<SubjectApp />}
                        />
                    </Routes>
                </BrowserRouter>
            </article>
        </React.StrictMode>,
    );
}
