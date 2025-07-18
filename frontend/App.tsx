import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MoveRight, QrCode, Speaker } from "lucide-react";
import background from "@/assets/image.svg";
import aptos from "@/assets/aptos.png";
import square from "@/assets/square.svg";
import rSquare from "@/assets/right-square.svg";

function App() {
  return (
    <>
      {/* <TopBanner /> */}
      {/* <Header /> */}
      <div className="relative flex justify-center min-h-screen xl:bg-black overflow-hidden">
        <div className="absolute w-full h-full" />
        <img
          src={background}
          alt="background"
          className="hidden xl:block min-w-full min-h-screen max-h-screen absolute top-0 left-0 bg-transparent p-2 z-1"
        />
        <img
          src={aptos}
          alt="Aptos Coin"
          className="hidden xl:block absolute w-[500px] z-20 left-1/2 -translate-x-1/2 bottom-60 animate-bounce-subtle"
        />
        <div className="hidden xl:block absolute w-40 xl:w-72 aspect-square bottom-60 left-32">
          <img src={square} alt="background square" className="absolute w-full h-full z-1" />
          <QrCode className="absolute top-0 right-0" stroke="white" size={80} />
          <div className="relative z-10 text-[#38D1BD] text-6xl flex flex-col gap-4 pl-8 pt-8">
            <span className="text-7xl">QR</span>
            <span>payment</span>
            <span className="text-white">in crypto</span>
          </div>
        </div>
        <div className="hidden xl:block absolute w-40 xl:w-72 aspect-square bottom-60 right-32">
          <img src={rSquare} alt="background square" className="absolute w-full h-full z-1" />
          <Speaker className="absolute bottom-0 left-0" stroke="white" size={80} />
          <div className="relative z-10 text-white text-5xl flex flex-col pl-8 pt-6">
            <span>Private.</span>
            <span>Fast.</span>
            <span>Paytos.</span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center xl:block gap-4">
          <div className="relative flex flex-col-reverse xl:flex-col items-center text-white text-center z-10 xl:h-full xl:mt-10">
            <div>
              <h2 className="text-2xl xl:text-4xl font-bold xl:mb-4">
                <span className="text-gradient">Privacy Payment</span> in crypto
              </h2>
              <h2 className="text-2xl xl:text-6xl font-bold">
                <span className="text-gradient">Stealth Address</span> & <span className="text-gradient">Bank</span>
              </h2>
            </div>
            <h1 className="text-6xl xl:text-[256px] xl:font-bold text-gradient tracking-widest xl:-mt-10">PAYTOS</h1>
          </div>
          <img src={aptos} alt="Aptos Coin" className="block xl:hidden w-[300px]" />
          <Link to="/login" className="z-50">
            <Button className="xl:absolute bottom-5 z-50 left-1/2 xl:-translate-x-1/2 flex items-center gap-2 text-black bg-white text-3xl font-bold p-8 rounded-full hover:bg-white/80">
              Explore now
              <MoveRight className="w-10 h-10" />
            </Button>
          </Link>
        </div>
      </div>
      {/* <div className="flex items-center justify-center flex-col">
				{connected ? (
					<>
						{!firstTimeMessage ? (
							<Card>
								<CardContent>
									<p>
										Whenever you reload the page, you need to sign a message to
										generate keys to authenticate with backend. This step will
										be removed in the future with zk proofs.
									</p>
									<button onClick={handleFirstTimeSignMessage}>
										Sign Message to generate keys
									</button>
								</CardContent>
							</Card>
						) : (
							<Card>
								<CardContent className="flex flex-col gap-10 pt-6">
									{metaSpendPublicKey ? (
										<>
											{username ? (

											) : (
												<div>
													<p>Please choose a username</p>
													<input
														type="text"
														placeholder="Username"
														onChange={(e) => setUsernameInput(e.target.value)}
														value={usernameInput || ""}
													/>
													<button onClick={handleSetUsername}>
														Set Username
													</button>
												</div>
											)}
										</>
									) : (
										<>
											<p>No Send Public Key</p>
											<p>
												Because it's first time you join. Sign a message to
												generate a view & send public key. This will be stored
												in local storage. You can recover it any time.
											</p>
											<button onClick={handleSetKeys}>
												Sign Message to generate keys
											</button>
										</>
									)}
								</CardContent>
							</Card>
						)}
					</>
				) : (
					<Card>
						<CardContent>
							<p>No connected wallet</p>
						</CardContent>
					</Card>
				)}
			</div> */}
    </>
  );
}

export default App;
