import Link from "next/link";

export const SignUp = () => {
    return(
        <section className="flex flex-col justify-center items-center p-10 m-auto">
            <h1 className="text-[5rem] leading-tight">Welcome to Design Co!</h1>
            <p className="text-[1.5rem] font-light">Please fill out all the fields to sign up:</p>

            <div className="mt-8 grid w-full max-w-4xl grid-cols-2 gap-5">
                <input type="text" placeholder="name" className="px-20 py-4 bg-white text-black text-center" />
                <input type="email" placeholder="email" className="px-20 py-4 bg-white text-black text-center" />
                <input type="password" placeholder="password" className="px-20 py-4 bg-white text-black text-center" />
                <input type="password" placeholder="confirm password" className="px-20 py-4 bg-white text-black text-center" />
                <input type="date" placeholder="birth" className="px-20 py-4 bg-white text-black text-center" />
                <input type="text" placeholder="gender" className="px-20 py-4 bg-white text-black text-center" />
                <input type="text" placeholder="grad year" className="px-20 py-4 bg-white text-black text-center" />
                <input type="text" placeholder="major" className="px-20 py-4 bg-white text-black text-center" />
            </div>

            <Link href="/" className="mt-8 bg-white px-[2rem] py-[1rem] text-black">
                {"sign up"}
            </Link>
        </section>
    )
}

export default SignUp;