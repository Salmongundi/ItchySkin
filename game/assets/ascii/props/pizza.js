export const pizzaSlice_001 = {
    states: {
        whole: `                                        
         &&                             
         &    &&.                       
        &      &&&&&&                   
       &&       &&&&&&&&&&              
        X &&&&;     X&&&&&&&&;          
         & &&&&&&         ;&&&&&        
         .  .&&&&&&&&         &&&       
        &     &&&&&&&&;        &&&      
       &&&&&&  &&&&&&&&&        &&&     
      &&&&&&&&   &&&&&&&&        &&&    
      &&;&&&&&     &&&&&&&  ;;;&&&&&&$  
     &&  &&&&&        &&&&&&&&& &&&&&&  
     &&                &&&&&&  &&&&&&&. 
    &&                    &&&&&&&&&&&   
    &&&        &&  &&&   & &&&&&&&&&&   
    &&&       &&&&&&&&&& &    &&&&&     
    &&&       &&&&&&&&& &:              
   +&&&        &&&&&&+  &:              
    &&&                &&               
   &&&&              &&&                
   &&&&&&&        &&&&                  
   &&&&&&      &&&&                     
   &&&     x&&&&&&                      
  X&&+ &&&&&&&&                         
  X&&&&&&&&                             
    &                                   
`,

        eaten: `                                        
         &&                             
         &    &&.                       
        &      &&&&&&                   
       &&       &&&&&&&&&&              
        X &&&&;     X&&&&&&&&;          
         & &&&&&&         ;&&&&&        
         .  .&&&&&&&&         &&&       
        &     &&&&&&&&;        &&&      
       &&&&&&  &&&&&&&&&        &&&     
      &&&&&&&&   &&&&&&&&        &&&    
      &&;&&&&&     &&&&&&&  ;;;&&&&&&$  
     &&  &&&&&        &&&&&&&&& &&&&&&  
     && &              &&&&&&  &&&&&&&. 
    &&  &  &x             &&&&&&&&&&&   
    &&&     &X &&  &&&   & &&&&&&&&&&   
    &&&       &&&&&&&&&& &    &&&&&     
    &&&     &&&&&&&&&&& &:              
   +&&&     :  &&&&&&+  &:              
    &&&     &          &&               
   &&&&    &         &&&                
   &&&&&&&        &&&&                  
   &&&&&&      &&&&                     
   &&&     x&&&&&&                      
  X&&+ &&&&&&&&                         
  X&&&&&&&&                             
    &                                   
`,

        crumbs: `                                        
                                        
                                        
                                        
                                        
                                        
                                        
           .x;.&                        
           ;x$&&X                       
           &&&                          
           xx&                          
                     ;&                 
                   &&&$&                
         .&&+;&    &..:                 
        &&&&+&&    &&&&&                
           &          $                 
         &&                             
                                        
         X                              
        &&&                             
         &&&x                           
        &X&$$                           
         &&&                            
                                        
                                        
                                        
                                        

`
    }
};




export const pizzaDefinition = {
    artwork: pizzaSlice_001,
    initialState: "whole",

    onClick: [
        {
            conditions: [
                {
                    type: "propStateIs",
                    state: "whole"
                }
            ],

            effects: [
                {
                    type: "setPropState",
                    state: "eaten"
                },
                {
                    type: "showMessage",
                    pages: [
                        "You take a bite out of the plastic pizza. \nIt's not nearly as filling as you hoped it would be."
                    ]
                }
            ]
        },

        {
            conditions: [
                {
                    type: "propStateIs",
                    state: "eaten"
                }
            ],

            effects: [
                {
                    type: "showMessage",
                    pages: [
                        "You take another bite of the plastic in the exact same place as before. \nSurprisingly, it looks exactly the same."
                    ]
                }
            ]
        }
    ]
};