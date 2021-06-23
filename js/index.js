(function ($) {
	let account = localStorage.getItem("account") || "";
	let chainId = localStorage.getItem("chainId") || null;
	const canConnect = typeof window.ethereum !== "undefined";
	let rollInterval;

	const checkConnection = async () => {
		// Reload on
		window.ethereum.on('chainChanged', (_chainId) => window.location.reload());

		if (account && chainId !== null) {
			$("#connectBtn").hide();
			$("#address").text(account);
		} else {
			$("#address").text("");
		}

		window.ethereum.on('accountsChanged', function (accounts) {
			console.log("account changed");
			disconnectAccount();
		});

		loadData();
	};
	checkConnection();
	$("#connectBtn").click(connectAccount);

	async function connectAccount() {
		if (canConnect) {
			console.log("Connecting via web3");
			try {
				const web3 = new window.Web3(window.ethereum);
				
				web3.currentProvider.on("disconnect", function () {
					disconnectAccount();
				});
				chainId = await web3.eth.getChainId();
				if (chainId !== 56 && chainId !== 97 && chainId !== 1337) {
					window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [{
							chainId: '0x38',
							chainName: 'Binance Smart Chain',
							nativeCurrency: {
								name: 'BNB',
								symbol: 'BNB',
								decimals: 18
							},
							rpcUrls: ['https://bsc-dataseed.binance.org/'],
							blockExplorerUrls: ['https://bscscan.com/']
						}]
					});
				}
				const accounts = await web3.eth.requestAccounts();
				account = accounts[0];
				localStorage.setItem("account", account);
				localStorage.setItem("chainId", chainId);
				console.log(account + " connected.");

				$("#address").text(account);
				$("#connectBtn").hide();
			} catch (err) {
				console.log("Failed to connect via web3");
				disconnectAccount();
			}
		}
	}

	function disconnectAccount() {
		console.log("disconnected");
		account = "";
		chainId = null;
		localStorage.removeItem("account");
		localStorage.removeItem("chainId");
		$("#connectBtn").show();
		$("#address").text("");
	}

	async function loadData() {
		try {
			const web3 = new window.Web3(window.ethereum);
			const contract = new web3.eth.Contract(contractABI, contractAddress);

			const min = web3.utils.fromWei(await contract.methods.minBid().call());
			const max = web3.utils.fromWei(await contract.methods.maxBid().call());
			const multiplier = await contract.methods.multiplier().call() / 10;
			const paused = await contract.methods.paused().call();
			
			$("#multiplier").text(multiplier);
			$("#bid").attr({
				max: max,
				min: min,
				step: 0.1
			});

			$("#rollBtn").prop("disabled", paused);
		}
		catch (err) {
			console.log(err);
		}
	}

	async function rollDice() {
		try {
			
			const web3 = new window.Web3(window.ethereum);
			const contract = new web3.eth.Contract(contractABI, contractAddress);

			const min = web3.utils.fromWei(await contract.methods.minBid().call());
			const max = web3.utils.fromWei(await contract.methods.maxBid().call());
			const paused = await contract.methods.paused().call();
			const guess = $("#guess").val();
			const bid = $("#bid").val()
			const randomSeed = Math.floor(Math.random() * Math.floor(1e9))

			if (paused) {
				alert("Thanks for visiting this site! The game is currently paused and not available to play. Please check back later.");
				return;
			}

			if (!guess || parseInt(guess) < 1 || parseInt(guess) > 6) {
				alert("Your guess must be a whole number between 1 and 6");
				return;
			}

			if ((!bid && bid !== 0) || parseFloat(bid) < min || parseFloat(bid) > max) {
				alert(`Your bid must be at least ${min} BNB and no more than ${max} BNB.`);
				return;
			}

			$("#rollBtn").prop("disabled", true);
			const wei = web3.utils.toWei(bid, "ether");
			const request = await contract.methods.rollDice(guess, randomSeed).send({
				from: account,
				value: wei
			}, function(err) {
				if (err) {
					alert("Something went wrong I guesss.");
				} else {
					roll();
				}
			});

			console.log(request);
			checkResults(request.events.DiceRolled.returnValues.requestId);
		} catch (err) {
			$("#rollBtn").prop("disabled", false);
			console.log(err);
			show(0);
		}
	}

	$("#rollBtn").click(rollDice);

	async function checkResults(requestId) {
		try {
			const web3 = new window.Web3(window.ethereum);
			const contract = new web3.eth.Contract(contractABI, contractAddress);

			let results = await contract.methods.games(requestId).call();
			let result = parseInt(results.result);
			let guess = parseInt(results.guess);
			if (result === 0) {
				setTimeout(checkResults.bind(null, requestId), 500);
			} else {
				$("#rollBtn").prop("disabled", false);
				console.log(results);
				show(result);
				if (guess === result) {
					$("#claimId").val(requestId);
					$("#winningValue").text(web3.utils.fromWei(results.bid, "ether") * 2);
					$("#claimWinnings").show();
				}
			}
		} catch (err) {
			console.log(err);
		}
	}

	async function claimWinnings() {
		try {
			$("#claimBtn").prop("disabled", true);
			const web3 = new window.Web3(window.ethereum);
			const contract = new web3.eth.Contract(contractABI, contractAddress);

			const claimId = $("#claimId").val();

			await contract.methods.claim(claimId).send({
				from: account
			}, function(err) {
				if (err) {
					$("#claimBtn").prop("disabled", false);
					alert("Something went wrong.");
				} else {
					$("#claimBtn").prop("disabled", true);
					$("#claimWinnings").hide();
				}
			});
		} catch (err) {
			$("#claimBtn").prop("disabled", false);
			alert("An error occurred somewhere.");
		}
	}

	$("#claimBtn").click(claimWinnings);

	function show(face) {
		clearInterval(rollInterval);
		if (face > 6) {
			return;
		}
		setTimeout(function() {
			$('#cube').attr("class", 'show' + face);
		}, 200);
	};

	function roll() {
		rollInterval = setInterval(function() {
			let face = getRandomInt(6);
			$('#cube').attr('class', 'show' + face);
		}, 100);
	}
	
	function getRandomInt(max) {
		return Math.floor(Math.random() * max) + 1;
	}
})(jQuery);