// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Strings.sol";
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

    /**
    * @dev Adds a new event to the contract.
    * @param _numVipTickets Number of VIP tickets available for the event.
    * @param _numSilverTickets Number of Silver tickets available for the event.
    * @param _vipTicketPrice Price of a VIP ticket in wei.
    * @param _silverTicketPrice Price of a Silver ticket in wei.
    * @param _eventName Name of the event.
    * @param _eventDate Date of the event as a Unix timestamp.
    * @param _eventVenue Venue of the event.
    *
    * Requirements:
    * - `_numVipTickets` must be greater than zero.
    * - `_numSilverTickets` must be greater than zero.
    * - `_vipTicketPrice` must be greater than zero.
    * - `_silverTicketPrice` must be greater than zero.
    * - `_eventName` must not be empty.
    * - `_eventDate` must be in the future.
    * - `_eventVenue` must not be empty.
    *
    * Emits an `EventCreated` event with the details of the new event.
    */
    function addEvent(
        uint256 _numVipTickets,
        uint256 _numSilverTickets,
        uint _vipTicketPrice,
        uint _silverTicketPrice,
        string memory _eventName,
        uint256 _eventDate,
        string memory _eventVenue
    ) public {
        require(_numVipTickets > 0, "Number of VIP tickets must be greater than zero");
        require(_numSilverTickets > 0, "Number of Silver tickets must be greater than zero");
        require(_vipTicketPrice > 0, "VIP ticket price must be greater than zero");
        require(_silverTicketPrice > 0, "Silver ticket price must be greater than zero");
        require(bytes(_eventName).length > 0, "Event name must not be empty");
        require(_eventDate > block.timestamp, "Event date must be in the future");
        require(bytes(_eventVenue).length > 0, "Event venue must not be empty");

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
    
        emit EventCreated(msg.sender, newEvent.eventId, newEvent.eventName, newEvent.vipTicketPrice, newEvent.silverTicketPrice, newEvent.eventDate);
   
    }

    /**
    * @dev Allows a user to buy a ticket for a specific event and category by sending the required payment.
    * @param _eventId The ID of the event.
    * @param _category The category of the ticket to buy ("VIP" or "Silver").
    *
    * Requirements:
    * - The ticket selling duration of the event must not have passed.
    * - For the specified category:
    *   - If "VIP", there must be available VIP tickets.
    *   - If "Silver", there must be available Silver tickets.
    * - The sent payment amount must be equal to the ticket price.
    * - The ticket must not have been already sold.
    *
    * Effects:
    * - Transfers the ticket price to the event owner.
    * - Marks the ticket as sold.
    * - Creates an order with the current timestamp and the purchased ticket.
    * - Associates the order with the user.
    *
    * Emits a `TicketBought` event with the details of the ticket purchase.
    */
    function buyTicket(uint256 _eventId, string memory _category) public payable{
        Event storage eventToBuy = events[_eventId];
        Ticket[] storage ticketsToBuy;
        uint256 numTicketsSold;
        uint256 ticketPrice;

        require(block.timestamp <= eventToBuy.sellingDuration, "Ticket Selling Duration has passed");

        

        if (Strings.equal(_category, "VIP")) {
            require(eventToBuy.vipSold < eventToBuy.numVipTickets, "All VIP tickets are sold out");
            ticketsToBuy = eventToBuy.vipTickets;
            numTicketsSold = eventToBuy.vipSold;
            ticketPrice = eventToBuy.vipTicketPrice;
            eventToBuy.vipSold++;
        } else if (Strings.equal(_category, "Silver")) {
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

 
    /**
    * @dev Retrieves the details of a specific event.
    * @param _eventId The ID of the event to retrieve.
    * @return eventOwner The address of the event owner.
    * @return eventId The ID of the event.
    * @return numVipTickets The total number of VIP tickets for the event.
    * @return numSilverTickets The total number of Silver tickets for the event.
    * @return vipSold The number of VIP tickets sold for the event.
    * @return silverSold The number of Silver tickets sold for the event.
    * @return sellingDuration The duration of the ticket selling period for the event.
    * @return eventName The name of the event.
    * @return _eventVenue The venue of the event.
    * @return eventDate The date of the event.
    * @return vipTickets An array containing the details of all VIP tickets for the event.
    * @return silverTickets An array containing the details of all Silver tickets for the event.
    *
    * Requirements:
    * - The specified event ID must be valid (less than the total number of events).
    */
    function getEvent(uint256 _eventId) public view returns (address eventOwner, uint256 eventId, uint256 numVipTickets, uint256 numSilverTickets, uint256 vipSold, uint256 silverSold, uint256 sellingDuration, string memory eventName, string memory _eventVenue, uint256 eventDate, Ticket[] memory vipTickets, Ticket[] memory silverTickets) {
        require(_eventId < numEvents, "Invalid event ID");

        Event storage eventToGet = events[_eventId];

        return (
            eventToGet.owner,
            eventToGet.eventId,
            eventToGet.numVipTickets,
            eventToGet.numSilverTickets,
            eventToGet.vipSold,
            eventToGet.silverSold,
            eventToGet.sellingDuration,
            eventToGet.eventName,
            eventToGet.eventVenue,
            eventToGet.eventDate,
            eventToGet.vipTickets,
            eventToGet.silverTickets
        );
    }


    /**
    * @dev Retrieves all events stored in the contract.
    * @return allEvents An array containing all the events.
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
