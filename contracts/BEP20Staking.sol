// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import '@pancakeswap/pancake-swap-lib/contracts/math/SafeMath.sol';
import '@pancakeswap/pancake-swap-lib/contracts/token/BEP20/IBEP20.sol';
import '@pancakeswap/pancake-swap-lib/contracts/token/BEP20/SafeBEP20.sol';
import '@pancakeswap/pancake-swap-lib/contracts/access/Ownable.sol';


contract BEP20Staking is Ownable {
    using SafeMath for uint256;
    using SafeBEP20 for IBEP20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;   // How many LP tokens the user has provided.
        bool isStaked;
    }

    // BEP20Token
    IBEP20 public immutable BEP20Token;
    // Info of each user that stakes LP tokens.
    mapping (address => UserInfo) public userInfo;
    // limit 41 BEP20Token here
    uint256 public limitAmount = 21000000000000000000;
    // The time when stake starts
    uint256 public startBlockNumber;
    // The time when stake ends
    uint256 public endBlockNumber;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);


    constructor(address _bep20Token, uint256 _startBlockNumber, uint256 _endBlockNumber) public {
        BEP20Token = IBEP20(_bep20Token);
        startBlockNumber = _startBlockNumber;
        endBlockNumber = _endBlockNumber;
    }

    modifier inValidPeriod() {
        require(block.number >= startBlockNumber && block.number < endBlockNumber, "Not within the validity period.");
        _;
    }

    modifier isEnded() {
        require(block.number >= endBlockNumber, "Withdrawal is prohibited until the sale is completed.");
        _;
    }

    // Set the limit amount. Can only be called by the owner.
    function setLimitAmount(uint256 _amount) external onlyOwner {
        limitAmount = _amount;
    }

    // Delayed end time.
    function shiftEndBlockNumber(uint256 _blockNumberOfShift) external onlyOwner inValidPeriod {
        endBlockNumber = endBlockNumber.add(_blockNumberOfShift);
    }

    // Stake tokens.
    function deposit(uint256 _amount) public inValidPeriod{
        UserInfo storage user = userInfo[msg.sender];
        require(_amount == limitAmount, 'The number of amounts deposit is not equal to the limit.');
        require(_amount > 0, "The number of amounts deposit must be greater than 0.");
        
        user.amount = user.amount.add(_amount);
        user.isStaked = true;
        require(BEP20Token.transferFrom(msg.sender, address(this), _amount), "Failed to deposit.");
        
        emit Deposit(msg.sender, _amount);
    }

    // Withdraw tokens.
    function withdraw(address _to, uint256 _amount) external onlyOwner isEnded {
        require(_amount > 0, "The number of amounts withdrawn must be greater than 0.");
        require(BEP20Token.transfer(_to, _amount), "Failed to withdraw.");

        emit Withdraw(_to, _amount);
    }

    // Query the user's stake state.
    function userStakeState(address _user) external view returns(bool) {
        return userInfo[_user].isStaked;
    }

    // Get the end time.
    function getEndBlockNumber() public view returns(uint256) {
        return endBlockNumber;
    }

    // Get the balance of the contract address BEP20Token.
    function getBep20Balance(address _user) public view returns(uint256) {
        return BEP20Token.balanceOf(_user);
    }

}