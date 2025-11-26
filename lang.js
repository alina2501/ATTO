(function () {
    const LANG_KEY = "atto_pref_lang";

    // Passe die Pfade an dein Repo an, falls du ATTO anders nennst
    const PATH_MAP = {
        de: {
            // Deutsche Seiten selbst
            "./index.html": "./index.html",
            "./projekt.html": "./projekt.html",
            "./erfolge.html": "./erfolge.html",
            "./ueber-mich.html": "./ueber-mich.html",
            "./tunneltrettnig.html": "./tunneltrettnig.html",

            // von EN → DE
            "./en/index.html": "../index.html",
            "./en/project.html": "../projekt.html",
            "./en/awards.html": "../erfolge.html",
            "./en/about.html": "../ueber-mich.html",
            "./en/tunneltrettnig.html": "../tunneltrettnig.html",

            // von FR → DE
            "./fr/index.html": "../index.html",
            "./fr/projet.html": "../projekt.html",
            "./fr/succes.html": "../erfolge.html",
            "./fr/apropos.html": "../ueber-mich.html",
            "./fr/tunneltrettnig.html": "../tunneltrettnig.html",
        },

        en: {
            // von DE → EN
            "./index.html": "./en/index.html",
            "./projekt.html": "./en/project.html",
            "./erfolge.html": "./en/awards.html",
            "./ueber-mich.html": "./en/about.html",
            "./tunneltrettnig.html": "./en/tunneltrettnig.html",

            // EN-Seiten selbst
            "./en/index.html": "./en/index.html",
            "./en/project.html": "./en/project.html",
            "./en/awards.html": "./en/awards.html",
            "./en/about.html": "./en/about.html",
            "./en/tunneltrettnig.html": "./en/tunneltrettnig.html",

            // von FR → EN
            "./fr/index.html": "../en/index.html",
            "./fr/projet.html": "../en/project.html",
            "./fr/succes.html": "../en/awards.html",
            "./fr/apropos.html": "../en/about.html",
            "./fr/tunneltrettnig.html": "../en/tunneltrettnig.html",
        },

        fr: {
            // von DE → FR
            "./index.html": "./fr/index.html",
            "./projekt.html": "./fr/projet.html",
            "./erfolge.html": "./fr/succes.html",
            "./ueber-mich.html": "./fr/apropos.html",
            "./tunneltrettnig.html": "./fr/tunneltrettnig.html",

            // von EN → FR
            "./en/index.html": "../fr/index.html",
            "./en/project.html": "../fr/projet.html",
            "./en/awards.html": "../fr/succes.html",
            "./en/about.html": "../fr/apropos.html",
            "./en/tunneltrettnig.html": "../fr/tunneltrettnig.html",

            // FR-Seiten selbst
            "./fr/index.html": "./fr/index.html",
            "./fr/projet.html": "./fr/projet.html",
            "./fr/succes.html": "./fr/succes.html",
            "./fr/apropos.html": "./fr/apropos.html",
            "./fr/tunneltrettnig.html": "./fr/tunneltrettnig.html",
        },
    };




    function currentPath() {
        // z.B. "/", "/index.html", "/ATTO/index.html",
        // "/fr/index.html", "/ATTO/fr/index.html", "file:///C:/.../index.html"
        let path = window.location.pathname;

        // Dateiname ermitteln (letztes Stück nach "/")
        const segments = path.split("/").filter(Boolean);
        const file = segments.pop() || "index.html"; // z.B. "index.html"

        // schauen, ob wir in einem Sprachordner sind
        const hasFr = path.includes("/fr/");
        const hasEn = path.includes("/en/");

        if (hasFr) {
            return "./fr/" + file;     // -> "./fr/index.html"
        }
        if (hasEn) {
            return "./en/" + file;     // -> "./en/index.html"
        }

        // alles andere behandeln wir als deutsche Root-Seiten
        return "./" + file;            // -> "./index.html", "./projekt.html", ...
    }

    function resolveTarget(lang) {
        const path = currentPath();
        const mapping = PATH_MAP[lang];
        if (!mapping) return null;

        // Wenn wir einen Eintrag kennen, verwenden wir ihn
        if (mapping[path]) return mapping[path];

        // Sonst: nicht umleiten
        return null;
    }

    function applyLanguage(lang) {
        localStorage.setItem(LANG_KEY, lang);
        const target = resolveTarget(lang);

        // Wenn wir wissen, wohin -> Seite wechseln
        if (target && target !== currentPath()) {
            const rest = window.location.search + window.location.hash;
            window.location.href = target + rest;
        }
    }

    function initModal() {
        const modal = document.getElementById("language-modal");
        if (!modal) return;

        const backdrop = modal.querySelector(".language-modal__backdrop");
        const buttons = modal.querySelectorAll("[data-lang]");

        buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const lang = btn.dataset.lang;
                applyLanguage(lang);
                modal.classList.remove("is-open");
            });
        });

        if (backdrop) {
            backdrop.addEventListener("click", () => {
                modal.classList.remove("is-open");
            });
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const saved = localStorage.getItem(LANG_KEY);

        if (saved) {
            // Sprache wurde schon mal gewählt -> automatisch auf richtige Version umleiten
            const target = resolveTarget(saved);
            if (target && target !== currentPath()) {
                const rest = window.location.search + window.location.hash;
                // replace = kein zusätzlicher History-Eintrag
                window.location.replace(target + rest);
                return;
            }
            // Wenn keine Umleitung nötig ist (z.B. schon auf /en/index.html),
            // zeigen wir das Popup NICHT mehr.
        } else {
            // Erste Session auf diesem Gerät/Browser -> Popup anzeigen
            const modal = document.getElementById("language-modal");
            if (modal) modal.classList.add("is-open");
        }

        // Events immer initialisieren, falls Popup später noch manuell genutzt wird
        initModal();
    });
})();
