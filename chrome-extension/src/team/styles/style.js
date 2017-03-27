export const styles = {
    issueHeader: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        paddingTop: "10px",
        fontSize: "16px",
        fontWeight: "600",
        color: "#000000",
    },
    issueStats: {
        display: "table",
        width: "100%",
        tableLayout: "fixed",
    },
    issueStat: {
        display: "block",
        paddingBottom: "10px",
        color: "#586069",
    },
    issueCount: {
        marginLeft: "5px",
    },
    issueListItem: {
        display: "table-cell",
        color: "#586069",
        textAlign: "center",
        borderLeft: "1px solid #eeeeee",
    },
    issueOpenIcon: {
        color: "#28a745",
    },
    issueClosedIcon: {
        color: "#cb2431",
    },
    teamLabel: {
        height: "30px",
        minWidth: "50px",
        marginLeft: "10px",
        borderRadius: "4px",
        background: "#000000",
        fontSize: "12px",
        fontWeight: "bold",
        padding: "5px 10px 5px 10px",
        textAlign: "center",
    },
    issueChart: {
        width: "100%",
        height: "200px",
        margin: "10px",
    },
    chartTitle: {
        margin: "10px 10px 0px 40px",
    },
    noStandupsHeading: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        fontSize: "24px",
        margin: "10px",
    },
    standupCard: {
        display: "flex",
        flexDirection: "column",
        borderRadius: "4px",
        margin: "10px",
        overflowY: "auto",
        fontSize: "14px",
        padding: "10px",
        height: "330px",
        width: "300px",
    },
    standupCardSection: {
        margin: "10px 0px 10px 0px",
        height: "110px",
    },
    standupCardSectionHeader: {
        fontWeight: "bold",
    },
    standupCardText: {
        wordWrap: "break-word",
    },
    standupSection: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
};

export default styles;