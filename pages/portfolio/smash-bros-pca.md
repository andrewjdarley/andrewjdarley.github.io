## Unsupervised Categorization of Smash Ultimate Characters via Matchup Data

<img src="/images/wolf_taunt.avif" alt="Wolf Taunt" />

In my Junior year of high school, I was introduced to competitive Smash Ultimate. After getting out of the casual realm of Kirby down-B spam and Electroshock arm where basically all players start, I began to notice just how deep and nuanced the game really is. Each character has a unique toolkit, and the way players talk about "matchups" and "playstyles" is well thought out and hyper-analyzed. The game is just so complex and there are so many interactions among the nearly 8,000 character matchups that every game can feel unique. 

The first character I used as my main was Wolf. Back then he was known as an easy-to-play S-tier character who also served as a good introduction character to high-level-play. To this day, Wolf is one of my favorite characters to play and I still have great success with him at tournaments. However, the playstyle I learned with Wolf was very weak to one of the most popular characters played by my high school peers, Bowser. 

Bowser's "Tough Guy" mechanic allows him to soak up weaker attacks without flinching. And unfortunately, my bread and butter as Wolf was a combo-starter move that could easily be sucked up by Tough Guy. This put me in an extremely disadvantagous position against anybody playing Bowser. Eventually, I was so fed up by this that I mastered a whole new character just to deal with this matchup. And so I began to play Palutena. 

However, I soon realized that both Palutena and Wolf were both quite weak against Mr. Game and Watch, another popular character among my peers and one of the strongest in the game. To counter this disadvantageous matchup, I learned to play Byleth to cover the weaknesses of my roster. BUT THEN, the atrocious monstrosity that is Steve was added to the cast who was able to counter all three of my characters! 

Can you see where this is going? 

Smash Bros is just that kind of game. And that has simultaneously been one of my favorite and one of my least favorite aspects of the game. I love how it feels different and unique to play each matchup, but I hate that my entire roster can be full-countered by a gameplay quirk unique to a single character. 

That's what gave me the idea for this project. This concept of matchup analysis is one that has been torn apart by the community. Below I've attached what is known as a matchup chart which places each character in the cast in a level depending on how easy or difficult their matchup against my characters. 

From left to right, we have Wolf, Palutena, then Byleth

<div style="display: flex; gap: 16px; justify-content: center; align-items: flex-start;">
  <img src="/images/wolf_chart.webp" alt="Wolf Character Analysis Chart" style="min-width: 200px; flex: 1 1 0; max-width: 100%; height: auto;" />
  <img src="/images/palutena_chart.webp" alt="Palutena Character Analysis Chart" style="min-width: 200px; flex: 1 1 0; max-width: 100%; height: auto;" />
  <img src="/images/byleth_chart.jpg" alt="Byleth Character Analysis Chart" style="min-width: 200px; flex: 1 1 0; max-width: 100%; height: auto;" />
</div>

While these are higher level matchup charts and should be expected to differ from my amateur experience, we can see some of the trends that I experienced in my gameplay. For instance, Steve is listed as a difficult matchup for all three of them while Mr. Game and Watch is marked as one of Byleth's relative easier matchups. 

My hypothesis was simple: analyzing these matchup charts as data points for each character would yield natural clustering. This clustering could help determine which characters are too similar to each other in critical matchups and which cover each other's weaknesses.

First I would need data. This posed some problems. 

There is no standard format for these mathchup charts. Everyone labels their tiers differently. I decided that in order to simplify I would parse each matchup into a numerical format where favorable matchups would be positive numbers and unfavorable ones would be negative numbers. 

Initially, I went straight to manual annotation purgatory and began digitizing the information found on <a href="https://www.reddit.com/r/smashbros/comments/1j0o2r5/ultimate_matchup_chart_compilation_v13/">This reddit post</a>. That was a mistake. I had to deal with every pro's different labeling scheme, not to mention that some of the links on the list no longer functioned. So I set out to see if my work had already been done for me. 