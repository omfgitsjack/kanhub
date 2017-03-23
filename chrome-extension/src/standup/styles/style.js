export const styles = {
  chatContainer: {
    position: "absolute",
    right: "0px",
    bottom: "0px",
    top: "0px",
    width: "320px",
    zIndex: "500",
    background: "#fafbfc",
  },
  chatHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: "54.4px",
    background: "#24292e",
    color: "#ffffff",
  },
  chatGroup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  chatSection: {
    display: "block",
    position: "absolute",
    top: "54px",
    bottom: "125px",
    width: "100%",
    height: "auto",
    backgroundClip: "content-box",
    overflow: "hidden",
    overflowY: "scroll",
  },
  chatMessageList: {
    padding: "10px 0px",
    listStyleType: "none",
  },
  chatMessageAuthor: {
    fontWeight: "bold",
    marginRight: "5px",
  },
  chatMessageContent: {
    margin: "0px",
    padding: "0px",
    boxSizing: "border-box",
  },
  chatMessage: {
    fontSize: "12px",
    lineHeight: "20px",
    padding: "6px 20px",
    margin: "-3px 0",
    wordWrap: "break-word",
    listStylePosition: "unset",
  },
  chatFooter: {
    position: "absolute",
    bottom: "0px",
    height: "125px",
    width: "100%",
    padding: "0px 15px 20px 15px",
    boxSizing: "border-box",
  },
  chatText: {
    height: "65px",
    width: "100%",
    resize: "none",
  },
};

export default styles;