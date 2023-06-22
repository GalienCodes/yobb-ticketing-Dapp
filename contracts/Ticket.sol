// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Ticketing contract for selling VIP and Silver tickets for events
/// @author [author name]
/// @notice This contract allows event organizers to create events and sell tickets to users
/// @dev This contract is written in Solidity version 0.8.0
contract Ticketing {

    event EventCreated(address indexed owner, uint256 indexed eventId, string name, uint256 VipticketPrice, uint256 SilverticketPrice, uint eventDate);
    event TicketBought(address indexed buyer, string category, uint256 ticketPrice );

    /// @notice Struct for storing information about a ticket
    struct Ticket {
        uint256 ticketId;
        bool isSold;
        uint256 eventId;
        uint256 price;
        string category;
        string eventName;
        uint256 eventDate;
        string eventVenue;  
    }
    
    /// @notice Struct for storing information about an event
    struct Event {
        uint256 eventId;
        address owner;
        uint256 numVipTickets;
        uint256 numSilverTickets;
        uint256 vipTicketPrice;
        uint256 silverTicketPrice;
        uint256 vipSold;
        uint256 silverSold;
        uint256 sellingDuration;
        string eventName;
        uint256 eventDate;
        string eventVenue;  
        Ticket[] vipTickets;
        Ticket[] silverTickets;
    }

    /// @notice Struct for storing information about an order
    struct MyOrder {
        uint timestamp;
        Ticket ticket;
    }

    /// @notice Mapping of event IDs to events
    mapping(uint256 => Event) public events;

    /// @notice Mapping of user addresses to the number of orders they've made
    mapping(address => uint256) public orderCount;

    /// @notice Mapping of user addresses to their orders
    mapping(address => mapping(uint256 => MyOrder)) public myOrders;

    /// @notice Mapping of user addresses to the number of events they've created
    mapping(address => uint256) public myEventCount;

    /// @notice Mapping of user addresses to their events
    mapping(address => mapping(uint256 => Event)) public myEvents;

    /// @notice Total number of events created
    uint256 public numEvents;

    /// @notice Duration for which tickets will be sold for an event
    uint256 constant SELLINGDURATION = 30 minutes;

    uint256 public tickets_counter = 0;

    /// @notice Allows an event organizer to create an event and sell tickets
    function addEvent(
        uint256 _numVipTickets,
        uint256 _numSilverTickets,
        uint _vipTicketPrice,
        uint _silverTicketPrice,
        string memory _eventName,
        uint256 _eventDate,
        string memory _eventVenue
    ) public {
        Event storage newEvent = events[numEvents];
        newEvent.eventId = numEvents;
        newEvent.owner = msg.sender;
        newEvent.numVipTickets = _numVipTickets;
        newEvent.numSilverTickets = _numSilverTickets;
        newEvent.vipTicketPrice = _vipTicketPrice;
        newEvent.silverTicketPrice = _silverTicketPrice;
        newEvent.sellingDuration = block.timestamp + SELLINGDURATION;
        newEvent.eventName = _eventName;
        newEvent.eventDate = _eventDate;
        newEvent.eventVenue = _eventVenue;  
        
        for (uint256 i = 0; i < _numVipTickets; i++) {
            Ticket memory ticket = Ticket({
                ticketId:tickets_counter,
                isSold: false,
                eventId: numEvents,
                price: _vipTicketPrice,
                category: "VIP",
                eventName: _eventName,
                eventDate: _eventDate,
                eventVenue:_eventVenue

            });
            newEvent.vipTickets.push(ticket);
            tickets_counter++;

        }
        for (uint256 i = 0; i < _numSilverTickets; i++) {
            newEvent.silverTickets.push(Ticket({
                ticketId: tickets_counter,
                isSold: false,
                eventId: numEvents,
                price: _silverTicketPrice,
                category: "Silver",
                eventName: _eventName,
                eventDate: _eventDate,
                eventVenue:_eventVenue

            }));
            tickets_counter++;
        }
        numEvents++;
        // Add order for user
        myEventCount[msg.sender]++; // <-- Order ID
        myEvents[msg.sender][myEventCount[msg.sender]] = newEvent;
    
         emit EventCreated(msg.sender, newEvent.eventId, newEvent.eventName, newEvent.vipTicketPrice, newEvent.silverTicketPrice, _eventDate);
   
    }
    /// @notice Allows a user to buy a ticket for an event
    function buyTicket(uint256 _eventId, string memory _category) public payable{
        Event storage eventToBuy = events[_eventId];
        Ticket[] storage ticketsToBuy;
        uint256 numTicketsSold;
        uint256 ticketPrice;

        require(block.timestamp <= eventToBuy.sellingDuration, "Ticket Selling Duration has passed");

        

        if (keccak256(bytes(_category)) == keccak256(bytes("VIP"))) {
            require(eventToBuy.vipSold < eventToBuy.numVipTickets, "All VIP tickets are sold out");
            ticketsToBuy = eventToBuy.vipTickets;
            numTicketsSold = eventToBuy.vipSold;
            ticketPrice = eventToBuy.vipTicketPrice;
            eventToBuy.vipSold++;
        } else if (keccak256(bytes(_category)) == keccak256(bytes("Silver"))) {
            require(eventToBuy.silverSold < eventToBuy.numSilverTickets, "All Silver tickets are sold out");
            ticketsToBuy = eventToBuy.silverTickets;
            numTicketsSold = eventToBuy.silverSold;
            ticketPrice = eventToBuy.silverTicketPrice;
            eventToBuy.silverSold++;
        } else {
            revert("Invalid ticket category");
        }

        require(msg.value == ticketPrice, "Incorrect amount sent");
        payable(eventToBuy.owner).transfer(ticketPrice);
        Ticket storage ticketToBuy = ticketsToBuy[numTicketsSold];
        require(!ticketToBuy.isSold, "Ticket already sold");
        ticketToBuy.isSold = true;
        // Create order
        MyOrder memory order = MyOrder(block.timestamp, ticketToBuy);
        // Add order for user
        orderCount[msg.sender]++; // <-- Order ID
        myOrders[msg.sender][orderCount[msg.sender]] = order;
        emit TicketBought(msg.sender, _category, ticketPrice );
    }

 
    function getEvent(uint256 _eventId) public view returns (address eventOwner, uint256 eventId, uint256 numVipTickets, uint256 numSilverTickets, uint256 vipSold, uint256 silverSold, uint256 sellingDuration, string memory eventName, string memory _eventVenue, uint256 eventDate, Ticket[] memory vipTickets, Ticket[] memory silverTickets) {
        Event storage eventToGet = events[_eventId];
        return (eventToGet.owner, eventToGet.eventId, eventToGet.numVipTickets, eventToGet.numSilverTickets, eventToGet.vipSold, eventToGet.silverSold, eventToGet.sellingDuration, eventToGet.eventName,eventToGet.eventVenue, eventToGet.eventDate, eventToGet.vipTickets, eventToGet.silverTickets);
    }

    /**
    * @dev Returns an array of all events stored in the contract.
    * @return An array of Event structs.
    */
    function getAllEvents() public view returns (Event[] memory) {
        Event[] memory allEvents = new Event[](numEvents);
        uint256 count = 0;
        for (uint256 i = 0; i < numEvents; i++) {
                allEvents[count] = events[i];
                count++;
            }
        return allEvents;
    }

}