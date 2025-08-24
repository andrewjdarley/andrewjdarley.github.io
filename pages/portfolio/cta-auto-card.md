## Call to Adventure Challenge Generator

<img src="/images/ctabox.jpeg" alt="Nonsense" style="max-width: 100%; height: auto;">

I am a huge fan of board games. I find few pastimes more fulfilling than allowing a simulated world to completely engross me by applying my mind to creative fictitious tasks. Generally, I think that games can appeal to me in one of three ways: elegant simplicity in games such as <a href="https://en.wikipedia.org/wiki/Chess">Chess</a> or <a href="https://boardgamegeek.com/boardgame/131357/coup">Coup</a>, complex and strategic rulesets in games such as <a href="https://boardgamegeek.com/boardgame/167791/terraforming-mars">Terraforming Mars</a> or <a href="https://magic.wizards.com/en/formats/booster-draft">MTG drafting</a>, or by playing to my preferences and interests in games such as <a href="https://boardgamegeek.com/boardgame/238992/call-to-adventure">Call to Adventure</a> . 

It's kind of crazy that an otherwise unremarkable game can be so appealing to me just by wrapping it up in something I like. I remember when I discovered there was <a href="https://boardgamegeek.com/boardgame/182626/mistborn-house-war">a Mistborn-themed Board Game</a>—I purchased the game the same day after skimming through the rulebook a single time. And while I do enjoy playing the game, I know that my main reason for doing so is because I'm a Brandon Sanderson fan. 

Call to Adventure appeals to my D&D and fantasy storytelling interests. That's why I bought it for my brother as a birthday present. But oh my, I have sunk more hours into Call to Adventure than I have literally any other board game, TV show, or video game. And that's not because of the appeal of its gameplay or its D&D appeal, rather its endless adaptability to the imaginations of me and my brothers.

### Game Overview

<img src="/images/ctaboard.jpg">

A game of Call to Adventure begins with each player choosing an origin card and a motivation card (Squire and Sole Survivor in the example above) which grant some starting stats and abilities. Additionally, the players choose a hidden destiny card which will provide additional points at the end of the game based on the actions they took and the results thereof (Force of Darkness in this case). These act as the starting point for each character and encourage what actions you will benefit from taking in the game. 

For example, the above player started with the Squire origin which provides a Strength (the orange sword) and a Dexterity (the gray arrow) as base stats and provides benefits for attempting challenges using those stats. This would encourage your character to attempt strength-based challenges such as slaying a dragon or battling in an army, or dexterity-based challenges such as stealing treasure from a dragon or rescue missions. 

<img src="/images/tablecta.jpg">

Without delving too much into the specifics, the game proceeds from this point in three acts representing things that can happen at various stages of a character's story. Each turn you can collect a trait card such as "Adventurous" or "Honorable" or attempt a challenge such as "Lost in the Woods" or "Magical Test". Additionally, when attempting a challenge, you have the option to choose one of two paths which grant different rewards for completing them. For example, the "Guard Duty" challenge located second from the left on the top row provides you two options. Either you can watch over the city, granting your character increased wisdom and a royal story point, or you can attempt the more difficult path of catching a criminal which grants increased dexterity and a justice story point as well as a point for your triumph. Like I said, I don't want to focus too much on the specifics of what these mean, rather I just want to give a basic understanding of how challenges work so you can understand the motivation for my project. 

### Alternative Gameplay Styles

Initially, my brothers and I enjoyed playing the game according to the written rules, competing for points using the system designed in the rules. We also played into the storytelling aspect that this game aims to create by telling the stories that emerged through this gameplay. We played this way for a long time until eventually one of our games inspired a short D&D campaign where the events of our game of Call to Adventure were the lore of the world we played in. After that we began creating D&D characters based on the stories we made in the game and battled them against each other, coming up with a ruleset for converting your story into a character. 

Eventually we transitioned into a while different way to play the game. We would play the game without any intention to win, rather we would attempt to recreate a character in a story we were all familiar with. We would allow slight bending of the rules for the sake of creating a more accurate representation of the character and emphasize the actions we took during the game if they were significant. 

For example, one of the first characters I attempted this with was Wesley from <a href="https://en.wikipedia.org/wiki/The_Princess_Bride_(film)">The Princess Bride</a>. To create him I chose my origin to be Farmer and my motivation to be Sworn Protector. Then I chose challenges in chronological order that reflected the major events of the story. Things such as "Climb to Safety", "Outwit a Gang Boss", or "Survive the Flames". I also collected allies, another mechanic I haven't really explained, such as "Swordmaster", or "True Love". Overall I was really satisfied with the way it all came together and this has been our main method of playing the game for the past while. 

<img src="/images/asyouwish.webp">

### Building the Model

Now finally, I can talk about the Data-Sciencey stuff after such a long-winded intro. Playing the game in this way made me wonder if we could just automatically expand the game. I was a bit skeptical as previous attempts to use ChatGPT to create things for Call to Adventure had shown very little understanding of the game's mechanics. But then after thinking about <a href="https://www.youtube.com/shorts/FJtFZwbvkI4">3blue1brown's video</a> on embedding spaces I came up with an idea. If you're unfamiliar with the concept of embedding spaces watch the video. It's only a minute long and will make this a lot more understandable.

If I were to find a sentence encoder and then pass in the various challenge paths, I could get an embedding that reflects the meaning of the challenge and the things that it's generally associated with. And in theory, we should expect there to be a direction in the embedding space that is associated with all the challenges involving Dexterity, or for the challenges that reward Justice points.

To test this idea, I manually entered all the challenge and path combinations from the game and used a pre-trained sentence transformer to generate embeddings for each one. Each embedding is a vector of numbers that captures the semantic meaning of the text. I then paired each embedding with the listed stats, difficulty, and rewards for that challenge and path. 

With this dataset, I built a simple K-Nearest Neighbors (KNN) model. The idea is that given a completely made-up challenge and path idea, I can encode it into the same embedding space and find the most similar existing challenges. Using this information, the model can infer what the most fitting characteristics to the challenge are by seeing which attributes are most commonly occuring in its K-nearest neighbors.

While the model itself proved great at finding candidates for the associated rewards, it didn't have any method of allocating them. So I analyzed the patterns used by the game-authors to deconstruct their reward scheme and found it to be quite simple to program. I just had to make the total rewards for each card sum-up to the difficulty of the challenge minus two. I also implemented some filtering methods similar to greenscreen math as to not cheapen the significance of certain story elements. Basically this means that if your fabricated challenge were to have roughly equal association with the theme of Justice and the theme of Nature it would put neither as a reward for the challenge. On the other hand, if the theme of Justice was notably more present in the K-nearest neighbors than every other story theme it would be added as a reward. Like greenscreen in the sense that a pixel is only considered green if it has a high green value and comparatively smaller red and blue values.

### Results

I encourage you to play around with <a href="https://colab.research.google.com/drive/1NCenWiTaoDJchFsOpCrCIGcJwAhI2IvG#scrollTo=kWWianRRaFH7">my demo</a> and judge it for yourself. 

Personally, through my experimentation I found that it worked way better than I ever expected it to. To demonstrate it at a large scale, I had AI generate 10 examples each from 5 well-known franchises and run them through the model. You can find the results at the bottom of the article. 

Some of the results honestly turned out excellent. With regards to the corresponding stats, I think there were some clearly exceptional results. For example, Mines of Moria, Horcrux Hunt, Dementor Attack, Order 66, Dark Dimension, and Hyrule Castle Infiltration were exactly what I would expect. 

But of course, there were some straight up failures such as the Battle of Five Armies and the Final Battle from Avengers Endgame. Those both were classified as strength-only challenges. But obviously a challenge requiring uniting forces would need to involve Charisma and using the infinity stones would require Constitution. But since the word "Battle" was included in each of the challenge names the model latched onto that far too much and hence included Strength as the only stat.

Additionally, in my experiments sometimes changing irrelevant details could completely change the results. Changing prepositions from "to" to "for" could change both of the predicted stats for the challenge. This is obviously very bad implying that the embedding space that I'm using is volatile and innacurate at times. We could certainly improve that though. 

<img src="/images/fivearmies.jpg">

### Conclusion

This project certainly has shown promise. But I need to change my paradigm. Ever since <a href="https://www.kaggle.com/competitions/byu-locating-bacterial-flagellar-motors-2025">the Kaggle competition</a> my research group hosted I have been overly focused on the pretrained models paradigm. The best solutions used pretrained vision models as backbones for their classifiers, at times not even touching the pre-trained weights. I tried to do the same thing in this case, just taking an off-the-shelf model and throwing it at my problem. 

I think a better approach to this problem would be contrastive learning, training a model to transform data from one space (the text on the cards) to another space (similar to our embedding space) while specifically trying to put similar instances close to each other and opposite images far from each other. In this problem, we can easily infer similar and opposite pairs by the stats used in each challenge and the story icons. I could make thousands of contrastive learning pairs with that information which would encode more meaning into the embedding space. 

Finally, I want to speak to you, the person reading this article who has no desire to ever play this game. This isn't mearly a nerdy project taken on by a fan of a niche community to distract himself. This could apply to other things in a similar way. One example that immediately comes to mind is D&D. What if instead of embedding the challenge names and corresponding paths we embedded character descriptions? You could provide a single paragraph and it could infer from data it trained on the new character's class, race, stats, equipment, spells, etc. A lot of the things that are difficult for a new player to come up with. Making character sheets for my younger cousins would be easy as pie!

I genuinely think that is the natural next step for something like this. While this could never work for Magic the Gathering, it could definitely work for other things like Pokemon cards or something as random as Fire Emblem character fabrication. But applications are ultimately limited as the model can only work to find the "average" between the k-nearest neighbors. What is the mean between a draw-four card and an uno reverse? It doesn't make sense to even ask that question. So creativity is certainly necessary in the application of this project. 

Anyway, I am excited to try contrastive learning on this problem. The next time I write about Call to Adventure I can skip a ton of fluff now that I wrote this all down. Overall this has been a great learning experience. And I love working on projects related to my passions. Now I just have to find a way to tie Attack on Titan into Data Science...

### Demo Data

Everything is abbreviated the way I recorded it initially. 

<i>Stats</i>: Str: Strength, Dex: Dexterity, Con: Constitution, Int: Intelligence: Wis: Wisdom, Cha: Charisma

<i>Story Symbols</i>: Justice: vengeance and justice. Crown: royalty and leadership. Nature: survival and nature. Mask: crime and espionage. Pure: divine and virtuous. Arcane: supernatural and magical. 

<i>Points</i>: 3G: 3 Triumph points. 2B: 2 Tragedy points

---
<div>

### Lord of the Rings Challenges

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #16213e; border-radius: 8px; overflow: hidden;">
  <thead>
    <tr style="background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
      <th colspan="3" style="padding: 12px; text-align: center; border-bottom: 1px solid #555;">Input</th>
      <th style="padding: 12px; width: 30px;"></th>
      <th colspan="3" style="padding: 12px; text-align: center; border-bottom: 1px solid #555;">Output</th>
    </tr>
    <tr style="background: #1a1a2e; color: #ccc;">
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Challenge</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Path</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444; width: 50px;">Act</th>
      <th style="padding: 10px 8px; width: 30px;"></th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444; width: 80px;">Difficulty</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Stats</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Rewards</th>
    </tr>
  </thead>
  <tbody style="color: #fff;">
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Siege of Helm's Deep</td><td style="padding: 8px; font-style: italic; color: #ccc;">Survive until Daybreak</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">7</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Con</td><td style="padding: 8px; color: #2d6a4f;">5G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Battle of Pelennor Fields</td><td style="padding: 8px; font-style: italic; color: #ccc;">Rally the Rohirrim</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">7</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Int</td><td style="padding: 8px; color: #2d6a4f;">Crown, 4G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Council of Elrond</td><td style="padding: 8px; font-style: italic; color: #ccc;">Convince the Fellowship</td><td style="padding: 8px; text-align: center; color: #667eea;">1</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Wis, Dex</td><td style="padding: 8px; color: #2d6a4f;">Wis, 1G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Mines of Moria</td><td style="padding: 8px; font-style: italic; color: #ccc;">Escape the Balrog</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Dex</td><td style="padding: 8px; color: #2d6a4f;">Con, Arcane</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Mount Doom</td><td style="padding: 8px; font-style: italic; color: #ccc;">Destroy the Ring</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">6</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex, Int</td><td style="padding: 8px; color: #2d6a4f;">4G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Isengard Assault</td><td style="padding: 8px; font-style: italic; color: #ccc;">Breach the Walls</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">6</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Int</td><td style="padding: 8px; color: #2d6a4f;">Justice, 3G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Dead Marshes</td><td style="padding: 8px; font-style: italic; color: #ccc;">Navigate Safely</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Int</td><td style="padding: 8px; color: #2d6a4f;">Con, 1B</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Shelob's Lair</td><td style="padding: 8px; font-style: italic; color: #ccc;">Defeat the Spider</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex, Int</td><td style="padding: 8px; color: #2d6a4f;">Int, Justice, 1B</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Battle of Five Armies</td><td style="padding: 8px; font-style: italic; color: #ccc;">Unite the Forces</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">6</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str</td><td style="padding: 8px; color: #2d6a4f;">Str, Crown, 4G</td></tr>
    <tr><td style="padding: 8px; font-weight: 600;">Weathertop</td><td style="padding: 8px; font-style: italic; color: #ccc;">Defend Against Nazgul</td><td style="padding: 8px; text-align: center; color: #667eea;">1</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Str</td><td style="padding: 8px; color: #2d6a4f;">Con, 1B</td></tr>
  </tbody>
</table>

---

### Harry Potter Challenges

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #16213e; border-radius: 8px; overflow: hidden;">
  <thead>
    <tr style="background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
      <th colspan="3" style="padding: 12px; text-align: center; border-bottom: 1px solid #555;">Input</th>
      <th style="padding: 12px; width: 30px;"></th>
      <th colspan="3" style="padding: 12px; text-align: center; border-bottom: 1px solid #555;">Output</th>
    </tr>
    <tr style="background: #1a1a2e; color: #ccc;">
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Challenge</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Path</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444; width: 50px;">Act</th>
      <th style="padding: 10px 8px; width: 30px;"></th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444; width: 80px;">Difficulty</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Stats</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Rewards</th>
    </tr>
  </thead>
  <tbody style="color: #fff;">
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Triwizard Tournament</td><td style="padding: 8px; font-style: italic; color: #ccc;">Win the Golden Egg</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex, Con</td><td style="padding: 8px; color: #2d6a4f;">Dex, Antihero, 1G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Chamber of Secrets</td><td style="padding: 8px; font-style: italic; color: #ccc;">Defeat the Basilisk</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Int</td><td style="padding: 8px; color: #2d6a4f;">Int, 2B</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Dementor Attack</td><td style="padding: 8px; font-style: italic; color: #ccc;">Cast a Patronus</td><td style="padding: 8px; text-align: center; color: #667eea;">1</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Cha</td><td style="padding: 8px; color: #2d6a4f;">Cha, Antihero</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Forbidden Forest</td><td style="padding: 8px; font-style: italic; color: #ccc;">Survive the Centaurs</td><td style="padding: 8px; text-align: center; color: #667eea;">1</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex, Wis</td><td style="padding: 8px; color: #2d6a4f;">Dex, 1B</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Battle of Hogwarts</td><td style="padding: 8px; font-style: italic; color: #ccc;">Protect the Castle</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">7</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Int, Str</td><td style="padding: 8px; color: #2d6a4f;">5G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Quidditch World Cup</td><td style="padding: 8px; font-style: italic; color: #ccc;">Escape Death Eaters</td><td style="padding: 8px; text-align: center; color: #667eea;">1</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex, Cha</td><td style="padding: 8px; color: #2d6a4f;">Dex, 1B</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Department of Mysteries</td><td style="padding: 8px; font-style: italic; color: #ccc;">Rescue Sirius</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Int, Wis</td><td style="padding: 8px; color: #2d6a4f;">Wis, Arcane</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Horcrux Hunt</td><td style="padding: 8px; font-style: italic; color: #ccc;">Destroy Slytherin's Locket</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex, Wis</td><td style="padding: 8px; color: #2d6a4f;">Dex, Antihero, 1B</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Dragon Challenge</td><td style="padding: 8px; font-style: italic; color: #ccc;">Steal from Gringotts</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">6</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex</td><td style="padding: 8px; color: #2d6a4f;">Dex, Justice, Hero, 3G</td></tr>
    <tr><td style="padding: 8px; font-weight: 600;">Maze of Champions</td><td style="padding: 8px; font-style: italic; color: #ccc;">Reach the Triwizard Cup</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">7</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Str</td><td style="padding: 8px; color: #2d6a4f;">Nature, 4G</td></tr>
  </tbody>
</table>

---

### Star Wars Challenges

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #16213e; border-radius: 8px; overflow: hidden;">
  <thead>
    <tr style="background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
      <th colspan="3" style="padding: 12px; text-align: center; border-bottom: 1px solid #555;">Input</th>
      <th style="padding: 12px; width: 30px;"></th>
      <th colspan="3" style="padding: 12px; text-align: center; border-bottom: 1px solid #555;">Output</th>
    </tr>
    <tr style="background: #1a1a2e; color: #ccc;">
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Challenge</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Path</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444; width: 50px;">Act</th>
      <th style="padding: 10px 8px; width: 30px;"></th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444; width: 80px;">Difficulty</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Stats</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Rewards</th>
    </tr>
  </thead>
  <tbody style="color: #fff;">
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Battle of Yavin</td><td style="padding: 8px; font-style: italic; color: #ccc;">Destroy the Death Star</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">6</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str</td><td style="padding: 8px; color: #2d6a4f;">Str, 5G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Cloud City Duel</td><td style="padding: 8px; font-style: italic; color: #ccc;">Survive Vader's Revelation</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Dex</td><td style="padding: 8px; color: #2d6a4f;">Con, Arcane, 1G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Podracing Boonta Eve</td><td style="padding: 8px; font-style: italic; color: #ccc;">Win Your Freedom</td><td style="padding: 8px; text-align: center; color: #667eea;">1</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex, Con</td><td style="padding: 8px; color: #2d6a4f;">Con, Mask</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Geonosis Arena</td><td style="padding: 8px; font-style: italic; color: #ccc;">Escape Execution</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Dex</td><td style="padding: 8px; color: #2d6a4f;">Con, 2G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Order 66</td><td style="padding: 8px; font-style: italic; color: #ccc;">Survive the Purge</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Int, Dex</td><td style="padding: 8px; color: #2d6a4f;">Int, Mask, 1B</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Mustafar Duel</td><td style="padding: 8px; font-style: italic; color: #ccc;">Defeat Your Former Master</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">6</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Int</td><td style="padding: 8px; color: #2d6a4f;">Str, Pure, 2G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Battle of Hoth</td><td style="padding: 8px; font-style: italic; color: #ccc;">Evacuate the Base</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Con</td><td style="padding: 8px; color: #2d6a4f;">Str, Crown, 1G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Jabba's Palace</td><td style="padding: 8px; font-style: italic; color: #ccc;">Rescue Han Solo</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; color: #667eea;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex, Con</td><td style="padding: 8px; color: #2d6a4f;">Dex, Antihero, 1G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Endor Shield Generator</td><td style="padding: 8px; font-style: italic; color: #ccc;">Destroy the Bunker</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">7</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Wis</td><td style="padding: 8px; color: #2d6a4f;">Str, 4G</td></tr>
    <tr><td style="padding: 8px; font-weight: 600;">Emperor's Throne Room</td><td style="padding: 8px; font-style: italic; color: #ccc;">Redeem Darth Vader</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">6</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Wis</td><td style="padding: 8px; color: #2d6a4f;">Con, Mask, 2B</td></tr>
  </tbody>
</table>

---

### Marvel Cinematic Universe Challenges

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #16213e; border-radius: 8px; overflow: hidden;">
  <thead>
    <tr style="background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
      <th colspan="3" style="padding: 12px; text-align: center; border-bottom: 1px solid #555;">Input</th>
      <th style="padding: 12px; width: 30px;"></th>
      <th colspan="3" style="padding: 12px; text-align: center; border-bottom: 1px solid #555;">Output</th>
    </tr>
    <tr style="background: #1a1a2e; color: #ccc;">
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Challenge</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Path</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444; width: 50px;">Act</th>
      <th style="padding: 10px 8px; width: 30px;"></th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444; width: 80px;">Difficulty</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Stats</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Rewards</th>
    </tr>
  </thead>
  <tbody style="color: #fff;">
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Battle of New York</td><td style="padding: 8px; font-style: italic; color: #ccc;">Stop the Chitauri Invasion</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">7</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Int</td><td style="padding: 8px; color: #2d6a4f;">Str, 4G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Sokovia Accords</td><td style="padding: 8px; font-style: italic; color: #ccc;">Keep the Team Together</td><td style="padding: 8px; text-align: center; color: #667eea;">1</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Con</td><td style="padding: 8px; color: #2d6a4f;">Con, Crown</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Infinity War</td><td style="padding: 8px; font-style: italic; color: #ccc;">Stop Thanos from Snapping</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">7</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Cha</td><td style="padding: 8px; color: #2d6a4f;">Str, 4G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Airport Battle</td><td style="padding: 8px; font-style: italic; color: #ccc;">Capture Winter Soldier</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Wis</td><td style="padding: 8px; color: #2d6a4f;">Wis, 2G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Dark Dimension</td><td style="padding: 8px; font-style: italic; color: #ccc;">Bargain with Dormammu</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">6</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Int, Con</td><td style="padding: 8px; color: #2d6a4f;">Antihero, 3B</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Asgard's Destruction</td><td style="padding: 8px; font-style: italic; color: #ccc;">Evacuate the People</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">7</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Wis</td><td style="padding: 8px; color: #2d6a4f;">Wis, Nature, 3G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Wakanda Defense</td><td style="padding: 8px; font-style: italic; color: #ccc;">Protect Vision</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Dex</td><td style="padding: 8px; color: #2d6a4f;">Dex, 2G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Quantum Realm</td><td style="padding: 8px; font-style: italic; color: #ccc;">Execute Time Heist</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex, Con</td><td style="padding: 8px; color: #2d6a4f;">Dex, Antihero</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Final Battle</td><td style="padding: 8px; font-style: italic; color: #ccc;">Wield the Infinity Stones</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str</td><td style="padding: 8px; color: #2d6a4f;">Str, 4G</td></tr>
    <tr><td style="padding: 8px; font-weight: 600;">Mandarin's Deception</td><td style="padding: 8px; font-style: italic; color: #ccc;">Expose the Truth</td><td style="padding: 8px; text-align: center; color: #667eea;">1</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Int, Dex</td><td style="padding: 8px; color: #2d6a4f;">Dex, Antihero</td></tr>
  </tbody>
</table>

---

### Breath of the Wild Challenges

<table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #16213e; border-radius: 8px; overflow: hidden;">
  <thead>
    <tr style="background: linear-gradient(135deg, #667eea, #764ba2); color: white;">
      <th colspan="3" style="padding: 12px; text-align: center; border-bottom: 1px solid #555;">Input</th>
      <th style="padding: 12px; width: 30px;"></th>
      <th colspan="3" style="padding: 12px; text-align: center; border-bottom: 1px solid #555;">Output</th>
    </tr>
    <tr style="background: #1a1a2e; color: #ccc;">
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Challenge</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Path</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444; width: 50px;">Act</th>
      <th style="padding: 10px 8px; width: 30px;"></th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444; width: 80px;">Difficulty</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Stats</th>
      <th style="padding: 10px 8px; border-bottom: 1px solid #444;">Rewards</th>
    </tr>
  </thead>
  <tbody style="color: #fff;">
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Calamity Ganon</td><td style="padding: 8px; font-style: italic; color: #ccc;">Seal the Darkness</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">6</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Wis, Str</td><td style="padding: 8px; color: #2d6a4f;">Mask, 3G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Divine Beast Vah Ruta</td><td style="padding: 8px; font-style: italic; color: #ccc;">Calm the Rampaging Elephant</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Cha</td><td style="padding: 8px; color: #2d6a4f;">Con, Nature, 1G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Lynel Encounter</td><td style="padding: 8px; font-style: italic; color: #ccc;">Claim the Shock Arrows</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Str, Int</td><td style="padding: 8px; color: #2d6a4f;">Int, Nature, 1B</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Hyrule Castle Infiltration</td><td style="padding: 8px; font-style: italic; color: #ccc;">Reach Zelda's Study</td><td style="padding: 8px; text-align: center; color: #667eea;">3</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">6</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Int, Dex</td><td style="padding: 8px; color: #2d6a4f;">Int, 3G</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Master Trials</td><td style="padding: 8px; font-style: italic; color: #ccc;">Prove Your Worth</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex, Con</td><td style="padding: 8px; color: #2d6a4f;">Dex, 2B</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Thunderblight Ganon</td><td style="padding: 8px; font-style: italic; color: #ccc;">Master Lightning Combat</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Wis, Int</td><td style="padding: 8px; color: #2d6a4f;">Int, 2B</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Eventide Island</td><td style="padding: 8px; font-style: italic; color: #ccc;">Survive with Nothing</td><td style="padding: 8px; text-align: center; color: #667eea;">1</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Dex</td><td style="padding: 8px; color: #2d6a4f;">Con, Hero</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Tarrey Town</td><td style="padding: 8px; font-style: italic; color: #ccc;">Build a Community</td><td style="padding: 8px; text-align: center; color: #667eea;">1</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; color: #667eea;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Dex, Str</td><td style="padding: 8px; color: #2d6a4f;">Dex, Hero</td></tr>
    <tr style="border-bottom: 1px solid #333;"><td style="padding: 8px; font-weight: 600;">Shrine of Resurrection</td><td style="padding: 8px; font-style: italic; color: #ccc;">Awaken from Slumber</td><td style="padding: 8px; text-align: center; color: #667eea;">1</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">4</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Wis, Con</td><td style="padding: 8px; color: #2d6a4f;">Wis, Antihero</td></tr>
    <tr><td style="padding: 8px; font-weight: 600;">Blood Moon Rising</td><td style="padding: 8px; font-style: italic; color: #ccc;">Endure the Malice</td><td style="padding: 8px; text-align: center; color: #667eea;">2</td><td style="padding: 8px; text-align: center; color: #667eea;">→</td><td style="padding: 8px; text-align: center; font-weight: bold; color: #d4691a;">5</td><td style="padding: 8px; font-family: monospace; color: #b3d1ff;">Con, Wis</td><td style="padding: 8px; color: #2d6a4f;">Con, Hero, 1B</td></tr>
  </tbody>
</table>