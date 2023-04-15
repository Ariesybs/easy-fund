// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract crowdFunding {
    //项目结构体
    struct Item {
        uint256 _id; //项目id
        string _name; //项目名称
        address _owner; //项目发起人
        string _type; //项目类型
        uint256 _needFunds; //所需资金
        uint256 _currentFunds; //当前募集的资金
        uint256 _deadline; //截止日期
        string _simpleDscr; //项目简述
        string _description; //描述
        string _imgUrl; //封面图片地址
        string _videoUrl; //视频地址
        address[] _donors; //捐款人地址
        string[] _donorName; //捐款人姓名
        uint256[] _donations; //捐款额
        string[] _donateTime; //捐款时间
        address[] _guarantors; //担保人
    }
    uint256 idOfItem = 1; //项目id
    mapping(uint256 => Item) _idToItem; //项目映射
    uint256[] _items; //众筹项目集合
    mapping(address => uint256) private _addressToId; //用户身份证号
    mapping(address => bool) _registeredUser; //已注册的用户
    mapping(uint256 => bool) _registeredId; //已注册ID
    mapping(address => uint256) _userReputation; //用户声誉值
    mapping(address => uint256) _guaranted; //用户已担保的项目
    mapping(address => mapping(uint256 => uint256)) _donateCount; //用户对某个项目的捐款次数

    modifier onlyNewUser() {
        require(!_registeredUser[msg.sender], "you are not the new user!");
        _;
    }

    modifier onlyRegisteredUser() {
        require(_registeredUser[msg.sender], "you dont have registered!");
        _;
    }

    event registerSuccess();
    event createItemSuccess();
    event donateSuccess(
        uint256 amount_,
        string donorName_,
        address donorAddr,
        string donateTime_
    );
    event updateReputationSuccess(uint256 reputation_);
    event beGuarantorSuccess(address user_);
    event updateMaxFundsSuccess(uint256 amount_);

    //判断是否注册（用于登录)
    function isRegister(uint256 id_) public view returns (bool) {
        return !_registeredId[id_] && !_registeredUser[msg.sender];
    }

    //用户注册
    function register(uint256 id_) public onlyNewUser {
        require(!_registeredId[id_], "this id have registered!");
        _registeredUser[msg.sender] = true;
        _registeredId[id_] = true;
        _addressToId[msg.sender] = id_;
        _userReputation[msg.sender] = 0;
        emit registerSuccess();
    }

    //用户登录
    function login(uint256 id_) public view returns (bool) {
        return id_ != 0 && _addressToId[msg.sender] == id_;
    }

    //获取用户声誉值
    function getReputation() public view returns (uint256) {
        return _userReputation[msg.sender];
    }

    //获取所有众筹项目
    function getAllItems() public view returns (uint256[] memory) {
        return _items;
    }

    function getItemById(uint256 id_) public view returns (Item memory) {
        return _idToItem[id_];
    }

    //发起众筹项目
    function createItem(
        string memory name_,
        uint256 needFunds_,
        uint256 deadline_,
        string memory simpleDscr_,
        string memory description_,
        string memory imgUrl_,
        string memory videoUrl_
    ) public onlyRegisteredUser {
        //require(deadline_ > block.timestamp,"invalid deadline!");
        require(needFunds_ <= maxFunds(msg.sender), "invalid needFunds!");
        Item storage item = _idToItem[idOfItem];
        item._id = idOfItem;
        item._name = name_;
        item._owner = msg.sender;
        item._needFunds = needFunds_;
        item._deadline = deadline_;
        item._simpleDscr = simpleDscr_;
        item._description = description_;
        item._imgUrl = imgUrl_;
        item._videoUrl = videoUrl_;
        item._guarantors.push(msg.sender);
        _guaranted[msg.sender] = idOfItem;
        _items.push(idOfItem);

        idOfItem++;
        emit createItemSuccess();
    }

    //成为项目担保人
    function beGuarantor(uint256 id_) public onlyRegisteredUser {
        Item storage item = _idToItem[id_];
        require(item._owner != address(0), "invalid id!");
        require(_guaranted[msg.sender] == 0, "you can not be guarantor again!");
        _guaranted[msg.sender] = id_;
        item._guarantors.push(msg.sender);
        emit beGuarantorSuccess(msg.sender);
    }

    //获取担保的项目
    function getGuaranted() public view returns (uint256) {
        return _guaranted[msg.sender];
    }

    //捐款
    function donate(
        uint256 id_,
        string memory name_,
        string memory time_
    ) public payable onlyRegisteredUser {
        uint256 amount_ = msg.value;
        //require(amount_ *100<= maxDonate(id_,msg.sender),"invalid amount!");
        Item storage item = _idToItem[id_];
        payable(item._owner).transfer(amount_);
        item._currentFunds += amount_;
        item._donors.push(msg.sender);
        item._donations.push(amount_);
        item._donorName.push(name_);
        item._donateTime.push(time_);

        _donateCount[msg.sender][id_] += 1;
        updateReputation(id_, msg.sender, amount_);
        emit donateSuccess(amount_, name_, msg.sender, time_);
    }

    //根据声誉值计算最大众筹金额
    function maxFunds(address owner_) internal view returns (uint256) {
        uint256 reputation = _userReputation[owner_];
        if (reputation < 100) {
            return 10;
        } else if (reputation >= 100 && reputation < 200) {
            return 20;
        } else if (reputation >= 200 && reputation < 300) {
            return 30;
        } else if (reputation >= 300 && reputation < 400) {
            return 40;
        } else if (reputation >= 400 && reputation < 500) {
            return 50;
        } else {
            return 60;
        }
    }

    //根据声誉值计算最大捐款金额
    function maxDonate(
        uint256 id_,
        address donor_
    ) internal view returns (uint256) {
        uint256 rate_ = 0;
        uint256 reputation = _userReputation[donor_];
        if (reputation < 100) {
            rate_ = 5;
        } else if (reputation >= 100 && reputation < 200) {
            rate_ = 10;
        } else if (reputation >= 200 && reputation < 300) {
            rate_ = 15;
        } else if (reputation >= 300 && reputation < 400) {
            rate_ = 20;
        } else if (reputation >= 400 && reputation < 500) {
            rate_ = 25;
        } else {
            rate_ = 30;
        }
        Item memory item = _idToItem[id_];

        return item._needFunds * rate_;
    }

    //获取最大众筹金额（初始时）
    function getMaxFund() public view returns (uint256) {
        return maxFunds(msg.sender);
    }

    //获取最大众筹金额（更新时）
    function getMaxFunds(uint256 id_) public view returns (uint256) {
        Item memory item = _idToItem[id_];
        uint256 guarantors = item._guarantors.length - 1;
        return maxFunds(msg.sender) + guarantors * 10;
    }

    //获取最大捐款金额
    function getMaxDonate(uint256 id_) public view returns (uint256) {
        return maxDonate(id_, msg.sender);
    }

    //更新众筹金额
    function updateMaxFunds(uint256 id_, uint256 amount_) public {
        uint256 maxFunds_ = getMaxFunds(id_);
        require(amount_ <= maxFunds_ * 10e18, "invalid amount!");
        Item storage item = _idToItem[id_];
        require(msg.sender == item._owner, "only owner!");
        item._needFunds = amount_;
        emit updateMaxFundsSuccess(amount_);
    }

    //更新声誉分
    function updateReputation(
        uint256 id_,
        address user_,
        uint256 amount_
    ) public {
        uint256 count = _donateCount[user_][id_];
        require(count > 0, "donate count is 0!");
        Item memory item = _idToItem[id_];
        uint256 rate_ = ((amount_ * 100) / (item._needFunds * 10e18));
        uint256 add_ = 0;
        if (rate_ <= 10) {
            add_ = 2;
        } else if (rate_ > 10 && rate_ <= 20) {
            add_ = 4;
        } else if (rate_ > 20 && rate_ <= 30) {
            add_ = 6;
        } else if (rate_ > 30 && rate_ <= 40) {
            add_ = 8;
        } else {
            add_ = 10;
        }
        _userReputation[user_] += add_ / count;
        emit updateReputationSuccess(_userReputation[user_]);
    }
}
