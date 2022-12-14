export default `
#content {
  --ll-left-size: 20vw;
  --ll-header-height: 10px;
  --ll-footer-height: 20px;
  overflow: hidden;
}
.header {
  width: 100%;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  height: var(--ll-header-height);
  padding-top: 8px;
  padding-bottom: 10px;
  margin-bottom: 4px;
  border-bottom: solid;
  border-width: 1px;
}
.footer {
  margin-top: 6px;
  margin-left: 4px;
  width: 100%;
  height: var(--ll-footer-height);
}
#left-box {
  flex: none;
  float: left;
  width: var(--ll-left-size);
  overflow: hidden;
}
#left {
  height: 100vh;
  width: var(--ll-left-size);
  display: flex;
  flex-direction: column;
}
@media only screen and (max-width: 600px) {
  #content {
    --ll-left-size: 80vw;
  }
  #left-box:hover {
    width: var(--ll-left-size);
  }
  #left-box {
    width: 10vw;
  }
}
#right {
  overflow:hidden;
  height: 100vh;
  margin-left: 1px;
  margin-right: 2px;
  flex: 1;
  width: 100%;
}
#content-right {
  overflow: auto;
  height: calc(100vh - (var(--ll-header-height) + 4%));
}
.content::-webkit-scrollbar {
  width: 4px;
  height: 4px;
}
.content::-webkit-scrollbar-track {
  background-color: initial;
}
.content::-webkit-scrollbar-thumb {
  background-color: rgba(249, 249, 249, 0.39);
  border-radius: 4px;
}
#content-left {
  flex: 1;
  overflow: auto;
  height: 100%;
  margin-left: 4px;
  margin-right: 4px;
}
hr {
  width: 100%;
}
`;
