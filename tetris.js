 /*------------------------------------------------------------------------*\
 *  FakeTris 0.1
 *  Written by: Logan J. Bell <loganbell@gmail.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.

 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.

 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *-------------------------------------------------------------------------*/


(function(window){
    // Game variables

    var TABLEHEIGHT = 20;
    var TABLEWIDTH  = 10;
    var PAUSE       = 0;
    var GAMESPEED   = 500;
    var score       = 0;
    var VERSION     = 0.3;
    var Game_Assets = window['Game_Assets'];     
    var gametimer;

    var statuswindow;
    var scorewindow;
    var current_shape;
    var current_color;
    var current_imgbg;

    // Key Being Constants
    var P       = 80;    
    var LEFT    = 37;
    var UP      = 38;
    var DOWN    = 40;
    var RIGHT   = 39;

    var Shape = function(){

			var self = this;
            self.currentposition = 0; 
            self.currentshape = 1;
            self.positions = new Array;

            self.init = function(){
                self.currentshape = Math.floor(Math.random() * self.shapes.length);
                self.positions = self.shapes[self.currentshape].positions;
                self.currentposition = Math.floor(Math.random() * self.shapes[self.currentshape].positions.length);
            };

            self.get_current_position = function(){
                return self.shapes[self.currentshape].positions[self.currentposition];
            };

            self.get_current_color = function(){
                return self.shapes[self.currentshape].color;
            };

            self.get_current_bg = function(){
                return "url(data:image/gif;base64," + Game_Assets.Images[self.shapes[self.currentshape].color];
            };

            self.get_current_shape = function(){
                return self.currentshape;
            };

            self.movedown = function() {

        		var current_position = self.get_current_position();
        		for (y in current_position){
        		    var coord = current_position[y];
        		    if (document.getElementById(coord)){
        		        document.getElementById(coord).style.backgroundColor=current_color;
        		        document.getElementById(coord).style.backgroundImage=current_imgbg;

        		    }
        		} 

                for (x in self.positions){
                    for (y in self.positions[x]){
                        self.positions[x][y][0]++;
                    }
                }
            };

            self.moveright = function(){
				var moveright_ok = 1;
				var current_position = self.get_current_position();
               	for (y in current_position){
               	    var coord = current_position[y];
               	    var nextcoord = [current_position[y][0],current_position[y][1]+1];
               	    if (current_position[y][1]+1 == TABLEWIDTH || document.getElementById(nextcoord).className === 'edge'){
               	        moveright_ok = 0;
               	    }
               	    if (!document.getElementById(nextcoord)){
               	        moveright_ok = 0;
               	    }
               	}
               	if (moveright_ok > 0){
               		for (x in self.positions){
               	     for (y in self.positions[x]){
               	         self.positions[x][y][1]++;
               	     }
               	 	}
				}
            }; 

            self.moveleft = function(){
            	var moveleft_ok = 1;
            	var current_position = self.get_current_position();
            	for (y in current_position){
            	    var coord = current_position[y];
            	    var nextcoord = [current_position[y][0],current_position[y][1]-1];
            	    if (current_position[y][1]- 1 == 0 && document.getElementById(nextcoord).className === 'edge'){
            	        moveleft_ok = 0;
            	    }
            	    if (!document.getElementById(nextcoord)){
            	        moveleft_ok = 0;
            	    }
            	}
            	if (moveleft_ok > 0){
                	for (x in self.positions){
                	    for (y in self.positions[x]){
                	        self.positions[x][y][1]--;
                	    }
                	}
				}
            }; 

            self.rotate = function() {
                self.currentposition = self.currentposition >= (self.positions.length - 1) ? 0 : self.currentposition + 1;
            }; 

            self.shapes = [
                {
                    'positions':[[[0,3],[0,4],[0,5],[0,6]],[[0,4],[-1,4],[-2,4],[-3,4]]],
                    'color': 'blue'
                }, 
                {
                    'positions':[[[0,5],[0,6],[1,5],[1,6]]],
                    'color': 'green'
                }, 
                {
                    'positions':[[[0,3],[0,4],[-1,4],[-1,5]],[[-1,4],[0,4],[0,5],[1,5]]],
                    'color': 'yellow'
                }, 
                {
                    'positions':[[[0,3],[0,4],[0,5],[-1,4]],[[-1,4],[0,4],[1,4],[0,5]],[[0,3],[0,4],[0,5],[1,4]],[[-1,4],[0,4],[1,4],[0,3]]],
                    'color': 'red'
                } 
            ];

    };

    /*
        Description: Binds keys for game play
        Input: None
        Output: None
    */
    bind_keys = function(){
        document.onkeydown = function(e){
			var keynum;
			if(window.event){
				keynum = e.keyCode;
			}
			else{
				keynum = e.which;
			}

			switch (keynum) {
				case UP:
                	current_shape.rotate();    
					break;
				case DOWN:
					current_shape.movedown();
					break;
				case RIGHT:	
			    	current_shape.moveright();
					break;
				case LEFT:
					current_shape.moveleft();
					break;
            	case PAUSE:
                	PAUSE = PAUSE === 1 ? 0 : 1;
                	if(PAUSE === 1){
					    clearInterval(gametimer);
						gametimer = null;
                	    statuswindow.innerHTML = 'Game Paused';
                	}else{
                	    gametimer = setInterval(gameplay,GAMESPEED);
                	    statuswindow.innerHTML = 'Game Started';
                	}
					break;
						
			}
		}

    };

    /*
        Description: builds game gride
        Input: None
        Output: None
    */
    build_grid = function(game_div){
        game_element = document.getElementById(game_div);
        statuswindow = document.createElement("div");
        statuswindow.id = 'status_window';
        statuswindow.innerHTML = 'Game Started';
        game_element.appendChild(statuswindow);

        scorewindow = document.createElement("div");
        scorewindow.id = 'score_window';
        scorewindow.innerHTML = 'Score is: ' + score;
        game_element.appendChild(scorewindow);

	    var table = document.createElement("Table");
        table.className="grid";
	    for(i = 0; i < TABLEHEIGHT; i++){
	    	var row = table.insertRow(i);
	    	for(j=0; j < TABLEWIDTH; j++){
	    		var cell = row.insertCell(j);
	    		cell.style.backgroundColor = 'black';
                cell.id = i+','+j;
	    	}	
	    }	
	    game_element.appendChild(table);
        return table;
    };

    /*
        Description: pauses game via clearing gametime
        Input: None
        Output: None
    */
    pause_game = function(){
		    clearInterval(gametimer);
		    gametimer = null;

    };
   
    /*
        Description: pauses game via clearing gametime
        Input: None
        Output: None
    */
    start_game = function(){ 
            gametimer = setInterval(gameplay,GAMESPEED);
    };

    /*
        Description: scans table for any complete rows
        Input: None
        Output: int
    */
    scan_for_complete_rows = function()
    {
        var reset_table = 0;

	    for(i = 0; i < TABLEHEIGHT; i++){
            var cellcount = 0;
	    	for(j=0; j < TABLEWIDTH; j++){
	    		var cell = document.getElementById(i+','+j);
                if (cell.className != 'edge'){
	    		    cell.style.backgroundColor = 'black';
	    		    cell.style.backgroundImage = '';
                }
                else{
                    cellcount++;    
                }
	    	}	
            if(cellcount == TABLEWIDTH){
                reset_table = i;
            }
	    }

        return reset_table;

    };

    /*
        Description: scans table for any complete rows
        Input: None
        Output: int
    */
    clear_table = function(reset_table){
	    for(x = reset_table; x > 0; x--){
	        for(j=0; j < TABLEWIDTH; j++){
                var row = x;
                var col = j;
                
                if (row <= reset_table){
                    prevrow = row - 1;
                    var prev_elem = document.getElementById(prevrow+','+col);
                    if (prev_elem){
                        var prev_bg_color = document.getElementById(prevrow+','+col).style.backgroundColor; 
                        var prev_bg_class = document.getElementById(prevrow+','+col).className;
                        document.getElementById(row+','+col).style.backgroundColor = prev_bg_color;
                        document.getElementById(row+','+col).className = prev_bg_class;
                        document.getElementById(prevrow+','+col).style.className = '';
                    }
                }
            }
        }       
        GAMESPEED *= .90;
    };

    /*
        Description: scans table for any complete rows
        Input: None
        Output: int
    */
    look_down = function(){
        var edge = 0;
        var current_position = current_shape.get_current_position();
        for (y in current_position){
                var coord = current_position[y];
                var nextcoord = [current_position[y][0]+1,current_position[y][1]];
                if (document.getElementById(nextcoord) && document.getElementById(nextcoord).className === 'edge'){
                    edge = 1;
                    current_shape = '';
                    continue;
                }
                if (coord[0] == (TABLEHEIGHT-1) ){
                    edge = 1;
                    current_shape = '';
                    document.getElementById(coord).className = 'edge';
                    
                }
        }
        return edge;
    };

    /*
        Description: stops a falling block if an edge is enountered
                     and detects if a block has ended the game.
        Input: None
        Output: None
    */
    stop_block = function(){ 
        var current_position = current_shape.get_current_position();
        for (y in current_position){
            var coord = current_position[y];
            if (coord[0] === 0){
	    	    clearInterval(gametimer);
	    	    gametimer = null;
                statuswindow.innerHTML = 'Game Over';
                document.getElementById(coord).className = 'edge';
                document.getElementById(coord).style.backgroundColor=current_color;
                document.getElementById(coord).style.backgroundImage=current_imgbg;
                break;
            }
            document.getElementById(coord).className = 'edge';
            document.getElementById(coord).style.backgroundColor=current_color;
            document.getElementById(coord).style.backgroundImage=current_imgbg;
        }
    };

    /*
        Description: Primary interface function in which the game is played
        Input: None
        Output: None
    */
    gameplay = function() {
        if (!current_shape){
            current_shape = new Shape;
            current_shape.init();
            current_color = current_shape.get_current_color();
            current_imgbg = current_shape.get_current_bg();
        }
        var reset_table = scan_for_complete_rows()
        if (reset_table){
            pause_game();
            update_score();
            clear_table(reset_table);
            start_game();
        }

        if (look_down()){
            stop_block();
        }else{
            current_shape.movedown();
        }
    };

    update_score = function() {
        scorewindow.innerHTML = 'Score is: ' + ++score;
    };

    /*
        Description: Public method to begin game
        Input: None
        Output: None
    */
    window['Game'] = { 
        start:function(game_div){
            build_grid(game_div);   
            bind_keys();
		    gametimer = setInterval(gameplay,GAMESPEED);
        }
    };
}(window));

