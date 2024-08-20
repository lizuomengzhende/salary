const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  icon: state => state.user.icon,
  name: state => state.user.name
}
export default getters
