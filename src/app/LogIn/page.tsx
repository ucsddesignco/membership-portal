import Link from "next/link";

export const LogIn = () => {
    return (
        <section className="flex flex-col justify-center items-center p-10 m-auto">
            <h1 className="text-[5rem]">Welcome Back!</h1>

            <div className="flex flex-col gap-5">
                <input placeholder="email" className="px-20 py-4 bg-white text-black text-center"></input>
                <input placeholder="password" className="px-20 py-4 bg-white text-black text-center"></input>
            </div>
            <div className="flex flex-row justify-center gap-4 mt-2">
                <p>forgot password</p>
                <Link href="/SignUp">sign up</Link>
            </div>
             
        </section>
    )
}

export default LogIn;