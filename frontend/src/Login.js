import {useRef, useState, useEffect, useLayoutEffect} from 'react';

const Login = () => {

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {

        userRef.current.focus();

    }, [])


    useEffect(() => {

        setErrMsg('');

    }, [user, pwd])

    //this is the part where you integrate axios
    //and global state to authentication
    const handleSubmit = async (e) => {

        e.preventDefault();
        //just for testing
        setSuccess(true);
        console.log(user, pwd);
        //we can clear those components when username and password 
        //is submitted
        setUser('');
        setPwd('');
        setSuccess(true);

    }

    return (

        <>
            {success ? ( //EDIT THIS PART - If Login is successful, then it will take us to homepage

                <section>
                        
                    <h1>You are logged in!</h1> 

                    <br />     
                    <p>
                       <a href="#">Go to Home</a>
                    </p>            
                </section>

            ) : (

        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : 
            "offscreen"} aria-live="assertive">{errMsg}</p>

            <h1>Sign In</h1>

            <form onSubmit={handleSubmit}> 
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    ref={userRef} //set focus on input
                    autoComplete="off" //set username with past entries
                    onChange={(e) => setUser(e.target.value)}
                    value={user} //important to when we want to clear form
                    required //user should know their own username
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password" //when we type in this field we don't see text, 
                                    //we see dots for privacy
                    id="password"
                    //ref={userRef} never set the focus on directly on password field
                    //autoComplete not supported by type password for input
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd} //important to when we want to clear form
                    required //user should know their own password
                />

                <button>Sign In</button>
            </form>
            <p>
                
                <span>
                    {/*place router link here*/}
                    <a href="#">Browse as Guest</a>
                </span>
            </p>

            
        </section>
            )}
            </>
    )
}

export default Login