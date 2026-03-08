export function Footer() {
    return (
        <footer style={{
            borderTop: "1px solid rgba(79,124,255,0.1)",
            padding: "24px", textAlign: "center",
            color: "var(--text-secondary)", fontSize: "13px",
            position: "relative", zIndex: 1,
        }}>
            <span style={{ marginRight: "8px" }}>Built with ❤️ at</span>
            <strong style={{ color: "var(--text-primary)" }}>Midwest Blockathon 2025</strong>
            <span style={{ margin: "0 12px", opacity: 0.3 }}>·</span>
            <span>XRPL + Pinata</span>
            <span style={{ margin: "0 12px", opacity: 0.3 }}>·</span>
            <a href="https://github.com/pushpakumar02/subledger" target="_blank" rel="noopener noreferrer"
                style={{ color: "#4f7cff", textDecoration: "none" }}>GitHub</a>
        </footer>
    );
}
