Specifications of the game

Players: Total of 5
1 Player, which is the user, will be the only person inputs a value
4 Non-player characters, known as "bots", controlled by computer, actions based on algorithms

Rules:
5 players each start with 10 lives.
After every round, the winner will not have a life deducted. However, the other 4 will lose a life. If there are more than one player having the same answer, which is the winning answer, players with the winning answer will not have life deducted. Player without an input will be considered losing the round.

The flow of the game.

1. Players input.
30 seconds for each round.
Every player inputs an integer between 0 and 100 (including 0 and 100)
then there will be 5 integer inputs from 5 players.
The game will then calculate the mean of the 5 inputs.
Then times the mean by 0.8, call it the "benchmark"
For example, if the inputs are {10, 20, 30, 40, 50}, the mean will be 30, the "benchmark" will be 30*0.8 = 24

2. Test for winning

According to the benchmark, the game will then find which inputted integer among the 5 is the closest to the benchmark, the input can be higher, lower or the same, as long as it is the closest, the player who inputted it will be the winner of this round.
Using the same example where benchmark = 24, then the player inputted 20 will win this round. If there exists players not inputing, then the mean calculation will be within those inputed, for example, the inputs are {N/A, N/A, 10, 20, 30}, the mean is 20, benchmark is 16

3. Conclude score movement

The winner will not be affected. Losers all lose a life.

4. Game Termination Condition

The game ends either:
1. The user player is eliminated, or
2. The user player is the only player remaining

the game should check for these 2 conditions every round.

Rules end here. The following will be the user layout and aesthetic designs.

1. The home page should show 5 boxes in the middle, where the user player will input the player name through a bar in the middle bottom of the page, under a message of "input username". after inputting, the username will appear in the 3rd box in the middle, which is very middle box. The other boxes will show as Bot1, Bot2, Bot3, Bot4. After that, the bar for inputing username is replaced by a block that say "click to proceed"

2. then the game starts. When the game starts, the game moves to first round. The layout, and rules for each round should remain the same in this demo version. The user player will see a block in the middle of the screen, that says input an integer between 0 and 100. While there is a bar the allows the user to type his/her preferred value. If the value is not an integer, an error message will appear below in red saying "Your input is not an integer". If the user inputs a valid integer, there will be a confirmation message in green, saying "Your input is registered". There should also be a timer at the top middle of the page, that counts down from 30 seconds to 0 seconds. If all players have typed a result, the count down ends early, and the game proceeds to the next stage.

3. After inputting the values, the game will compile the results and find winners and losers. There must exist a page showing the results after each round. After the countdown process, the game will move to a new page where, there will be 5 boxes in the middle, showing both username and the value inputted the round before. If there were no input, the value is "N/A". Then, the above the 5 boxes in the middle, on the top left part of the screen, there will be a box that says "mean = X", another box in top right will say "benchmark = Y", where X and Y are the mean and benchmark calculated for the previous round. In the bottom of the page, below each player, there  should exist a box that says "remaining life = Z". Z decreases from 10 to 0 as the game proceeds. Below the remaining life box, there is a note that either says "Winner of the round" or "Loser of the round","Winner of the round" is a message in color green; "Loser of the round" is a message in color red.

4. A "Proceed to next round" button should appear in the bottom of the page. After everyone clicked proceed, the game moves to the next round where the countdown occurs again.

5. The game repeats until the user player becomes the remaining player, or the user player has no more remaining lives. After all players have selected proceed, the game ends.

6.  When the game ends, the game moves to a final page, where players can find a time series line graph that tracks their remaining lives with respect to the round number. The line graph should be in 5 different colors, and are labelled with user names. The graph appears in the bottom middle of the page. On top, there will be a message for ending the game. If the player is a winner, display, "Congratulations, you are the winner.", if the player loses, display "Well played, thank you for joining."
