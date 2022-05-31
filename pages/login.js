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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

const Login = () => {
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);

  const handleClick = (provider) => {
    provider === "google" ? loginWithGoogle() : loginWithFacebook();
    setRedirect(true);
  };

  useEffect(() => {
    if (redirect) router.push("/");
  }, [redirect]);

  return (
    <div className="flex">
      <Link href="/">
        <BackIcon>
          <ArrowBackIcon fontSize="large" />
        </BackIcon>
      </Link>

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

export default Login;

const Wrapper = tw.div`
    flex
    justify-content
    items-center
    relative
    `;

const FormContainer = tw.div`
    absolute
    top-1/4
    lg:left-[37.5%]
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
    z-50
    w-5/6
    md:w-1/2
    lg:w-1/4`;

const BackIcon = tw.div`
    flex
    self-start
    m-4
    p-2
    rounded-full
    bg-white
    relative
    z-50
    shadow-md
    hover:bg-[rgb(247,247,247)]
    cursor-pointer
    `;
