import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { api } from "~/utils/api";
import Image from "next/image";
import { Box, Checkbox, IconButton, Tooltip } from "@mui/material";
import Header from "~/components/marketplace/header";
import ShareCube from "~/components/cubes/share_cube";
import ShareIcon from "@mui/icons-material/Share";
import SharePackageDialog from "~/components/SharePackageDialog";

type EventRegisterProps = {};

const EventRegister: React.FC<EventRegisterProps> = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const eventId = router.query.eventId as string;
  const queryReferral = router.query.referral as string;
  const [referral, setReferral] = useState<string>(queryReferral ?? "");
  const [openShareModal, setOpenShareModal] = useState<boolean>(false);
  const [checkBoxValue, setCheckBoxValue] = useState<boolean>(
    queryReferral ? false : true,
  );

  const mutation = api.event.registerEvent.useMutation();

  const RegisterEventFunction = () => {
    if (session?.user.id) {
      mutation.mutate(
        {
          registerId: eventId,
          referral: checkBoxValue ? referral ?? queryReferral : queryReferral,
        },
        {
          onSuccess: ({ message }) => {
            toast.success(message);
          },
          onError: (e: any) => {
            console.log(e);
            toast.error("Something went wrong");
          },
        },
      );
    } else {
      toast.success("Login/Signup required");
    }
  };
  const handleSharePackageClose = () => {
    setOpenShareModal(false);
  };

  return (
    <>
      <div>
        <Header />
        <main
          className="calc flex flex-col items-center justify-center bg-gradient-to-b from-[#040306] to-[#494952]"
          style={{ height: "calc(100vh - 4rem)" }}
        >
          <div className="container flex flex-col items-center justify-center gap-5 px-4 py-16">
            <Image
              src={process.env.NEXT_PUBLIC_APP_LOGO!}
              width={600}
              height={600}
              alt="Logo"
            />
            {session?.user.id && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <h3
                  className={`${
                    queryReferral ? "pr-12" : "pr-10"
                  } flex text-xl font-bold text-white`}
                >
                  {queryReferral ? "Referral" : "Have a referral?"}
                </h3>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "5px",
                  }}
                >
                  <Box
                    sx={{
                      gap: 2,
                      padding: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <input
                      disabled={!checkBoxValue}
                      className={`text-xlg rounded-lg bg-white/10 px-5 py-3 text-white no-underline transition ${
                        !checkBoxValue && "cursor-not-allowed opacity-40"
                      }`}
                      value={referral}
                      onChange={(e) => setReferral(e.target.value)}
                    />
                    <Tooltip title="share cube" placement="top">
                      <IconButton
                        onClick={() => setOpenShareModal(!openShareModal)}
                      >
                        <ShareIcon
                          sx={{
                            color: "var(--sugarhub-text-color)",
                            fontSize: "2rem",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                    <SharePackageDialog
                      open={openShareModal}
                      onClose={handleSharePackageClose}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            <p className="text-center text-2xl text-white">
              {session && <span>Logged in as {session.user?.username}</span>}
            </p>
            <div
              className={`${
                session?.user.id &&
                "grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"
              }`}
            >
              {session?.user.id && (
                <button
                  className="text-xlg rounded-full bg-white/10 px-10 py-6 font-semibold text-white no-underline transition hover:bg-white/20"
                  onClick={() => void signOut()}
                >
                  {"Sign out"}
                </button>
              )}
              <button
                className="text-xlg rounded-full bg-white/10 px-10 py-6 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={
                  session?.user.id
                    ? () => RegisterEventFunction()
                    : () => void signIn()
                }
              >
                Register
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
export default EventRegister;
