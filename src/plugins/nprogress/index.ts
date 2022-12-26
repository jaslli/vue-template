import NProgress from "nprogress";
import './nprogress.css'

// nprogress的配置
NProgress.configure({
    // Changes the minimum percentage used upon starting
    minimum: 0.4,
    // Adjust animation settings using easing (a CSS easing string) and speed (in ms).
    easing: 'ease',
    speed: 500,
    // Turn off loading spinner by setting it to false
    showSpinner: false,
    // Adjust how often to trickle/increment, in ms.
    trickleSpeed: 200
})

export default NProgress