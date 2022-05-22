import { useEffect, useState } from "react";
import Image from "next/image";
import login_bg from "../assets/login_bg.jpg";
import tw from "tailwind-styled-components";
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from "react-social-login-buttons";
import { loginWithGoogle, loginWithFacebook } from "../firebase";
import { useRouter } from "next/router";

const login = () => {

  const router = useRouter();
  const [redirect, setRedirect] = useState(false)

  const handleClick = (provider) => {
      provider === "google" ? loginWithGoogle() : loginWithFacebook()
      setRedirect(true)

  }

  useEffect(() => {
    if(redirect) router.push('/')
  }, [redirect]);

  return (
    <div className="flex ">
      <FormContainer>
        <div className="mb-4 w-full">
          <GoogleLoginButton onClick={() => handleClick("google")} />
        </div>

        <FacebookLoginButton onClick={() => handleClick("facebook")} />
      </FormContainer>
      <Image
        src={login_bg}
        alt="background image"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        className="z-10"
      />
    </div>
  );
};

export default login;

const Wrapper = tw.div`
    flex
    justify-content
    items-center
    relative
    `;

const FormContainer = tw.div`
    absolute
    top-1/4
    left-[37.5%]
    rounded-lg
    shadow-md
    box-border
    flex
    flex-col
    items-center
    bg-[rgb(247,247,247)]
    mx-auto
    lg:m-0
    lg:mb-4
    lg-mt-8
    mt-8
    ml-8
    p-8
    h-auto
    lg:z-50
    w-1/4`;
