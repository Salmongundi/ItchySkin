export const drillBit = {
    states: {
        normal: `                                            
                                            
                                            
                        @@@@@@@@@@          
                      @@@@@@@@@@@@@         
                     @@@@ @@@@@@:@@@        
                    @@@= @@@%@@@ @@@#       
                  @@@@  @@@@ @@@  @@@       
                 @@@@   @@@  @@@: .@@@      
                @@@@   @@@@@@@@@@  @@@@     
                @@@    @@@@@@@@@@   @@@     
               %@@@   @@@     @@@   @@@#    
               *@@@@-#@@@     @@@   @@@     
               @@@@@@@@@      @@@   @@@     
               @@@@@@@@@      *@@@@@@@@     
               @@@ @@@@       @@@@@@@@.     
               @@@  @@         @@@@@@@      
              :@@@                 @@@      
               @@@@@@   @@@@@   @@@@@@@     
               @@@@@@@ @@@@@@@%@@@@@@@=     
              *@@@  @@@@@: :@@@@@=@@@@#     
              @@@  @@@@@     @@@@  @@@      
              @@@  @@@       =@@@  @@@      
              @@@  @@@-      @@@% *@@@      
              @@@  @@@       @@@  %@@+      
             @@@@  @@@       @@@  @@@       
             @@@@  @@#       @@@  @@@       
             @@@  @@@+      @@@@ *@@@       
             @@@  @@@       @@@  -@@*       
             @@@  @@@       @@@  @@@@       
            *@@@  @@@       @@@  @@@        
            %@@  @@@@      *@@@  @@@        
            @@@  @@@       @@@= @@@@        
            @@@  @@@:      @@@  *@@-        
            @@@  @@@       @@@  @@@         
           %@@@  @@@      -@@@  @@@         
           @@@@  @@%      %@@@  @@@         
           @@@  @@@*      @@@  @@@@         
           @@@@@@@@@      @@@  @@@@         
           @@@@@@@@@@@@@@@@@@@@@@@          
          .@@@      .: @@@@@@@@@@@          
          @@@                 -@@@          
          @@@                 -@@*          
          @@@                 @@@           
         :@@@                 @@@           
         #@@@                 @@@           
         @@@@                @@@@           
         @@@                 @@@-           
         @@@                 @@@            
         @@@                 @@@            
        :@@@                +@@@            
        @@@                 :@@*            
        @@@-                @@@-            
        @@@                 @@@             
        @@@                 @@@             
       +@@@                @@@@             
       @@@@                @@@=             
       @@@                 @@@-             
       @@@                 @@@              
       @@@                 @@@              
      .@@@                @@@*              
      #@@                 @@@=              
      @@@                 @@@               
      @@@                 @@@               
        @@@@@@@@@@@@@@@  @@@:               
         #%*@@@@@@@@@@@@@@@                 
                       .                    
                                            `
    }
};


export const drillBitDefinition = {
    artwork: drillBit,
    initialState: "normal",

onClick: [
    {
        conditions: [
            {
                type: "factIs",
                fact: "jerboaLeftTent",
                value: true
            },
        ],
        effects: [
            {
                type: "addItem",
                item: {
                    id: "drillBit",
                    name: "Drill Bit"
                }
            },
            {
                type: "removeProp"
            },
            {
                type: "showMessage",
                pages: [
                    "Thank goodness Jerboa is gone or this would be considered stealing!",
                    "You quickly stuff the drill bit in your back hair before anyone sees you."
                ]
            }
        ]
    },
    {
        effects: [
            {
                type: "showMessage",
                pages: [
                    "What a beautiful drill bit. It looks like Jerby might be using it as a makeshift pool cue.",
                    "It's a little too burglesome to take it while Jerby is home, so you leave it alone for now."
                ]
            }
        ]
    }
]
};