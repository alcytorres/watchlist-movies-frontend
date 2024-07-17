// import { Link } from "react-router-dom";
import {LogoutLink} from './LogoutLink'

export function Header() {
  return (
    <header>
        {/* <a href="#">Home</a> | <a href="#">Link</a> */}
        <a href="/">Home</a> | <a href="/signup">Signup</a> | <a href="login">Login</a> | <LogoutLink />
        {/* <a href="recipes-index">Home</a> | <a href="#recipes-index">All recipes</a> | <a href="#recipes-new">New recipe</a> */}
    </header>
  )
}
