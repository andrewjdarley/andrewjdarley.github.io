## Statistical Analysis of the Brawl Stars Matchmaking Algorithm

<img src="/images/knight-amber.avif" style="width: 100%; height: auto; max-width: 100%;">

The reality of all video games is they all need a monetization model. And among the thousands of garbage mobile games that all rely on ads or pay-to-win mechanics, Brawl Stars stands out with a much more enjoyable monetization model. Its big selling point is cosmetic items, more specifically, skins for your characters. 

Featured in the center of the image above is a character named Amber's new skin and I think it looks absolutely amazing. The only skin available that is nearly as good as this "Dark Knight" theme is an Elsa-inspired skin with an ice theme. This skin was being given away to everyone who could get nine wins in a challenge before losing their four lives. If you did end up losing all four lives, you could pay a small amount of in-game currency to get some extra tries to get you the rest of the way. Sounds fair, right? 

I ended up buying extra lives for this challenge far far far too many times. And I'm ticked about it. Ticked enough to write an expose on the matchmaking algorithm even though nobody has any idea what I'm talking about! 

Of course I'm not petty! Just tenacious ;)

During this challenge I played the game a lot more casually, meaning I was low rank compared to others playing the challenge. As I played, I felt like the matchmaking was rigged against me. It seemed like I was consistently being matched up against lower ranked players that just had no idea what to do. On the other hand, my opponents were frequently average to above-average rank, meaning they're capable of working effectively with a team, even if its a team of randoms they had never played with before this moment. 

Game after game after game after game this happened with me buying more and more tries. And I was getting really mad about it. Eventually I temporarily gave up on the challenge and grinded out ranked matches until I was the above-average rank. And what do you know? Matchmaking became substantially easier. Occasionally I was put against a team of equal skill to my own, but more often than not the teams seemed to be in my favor. 

It should be obvious why this form of matchmaking is bad for your average player who only occasionally picks up the game. It is the equivalent of showing up to a dodgeball match and allowing the best player to choose their entire team and leaving the rest to be crushed. All competition is lost at that point. It really sucks. But this makes sense if you are designing the monetization model for your game. The better players are your source of revenue, not the casuals. Even still, I think it's unfair, especially since I am committed to the game, just not ranked. 

So I did what any normal person would do. <s>Laugh it off and move on</s> Learn how to use the Brawl Stars API and make a webscraper to gather a dataset of 3000 games and dredge up old AP stats knowledge to prove I am not crazy!

<img src="/images/definitelynotsymbolic.jpg">

### Data Wrangling Challenges

The only reason this project is at all feasible is because Brawl Stars has a public <a href="https://en.wikipedia.org/wiki/API">API</a> that allows you to view a player's recent battles. However the API has some severe limitations that caused me some grief. First, a player's battle log only saves the 25 most recent battles for each player so that's all I can get through the API. 25 battles is far far too small for me to establish statistical significance. Plus it wouldn't be a random sample, rather a textbook example of <a href="https://en.wikipedia.org/wiki/Data_dredging">p-hacking</a>. So we've got to find a way around that. 

Second, there is no way to get a player's rank from the account info API. This means I cannot actually prove my original hypothesis, that the matchmaking is rigged to favor players of higher rank. However, I can get a player's cumulative trophy count through the API. I keep throwing around terminology so I suppose it's time for me to define some things. There are close to a hundred playable characters in Brawl Stars and each of those have an associated <b>trophy count</b> that you can increase by winning non-competitive battles. Each player has a <b>cumulative trophy count</b> that is just the sum of all trophy counts for each of your characters. 

On the other hand, <b>rank</b> is a single number associated with your account rather than individual characters. It can be increased or decreased depending on your performance in competitive battles. This is the independent variable that I believe is affecting the matchmaking algorithm that for some reason isn't available through the API. However, I think it is reasonable to assume that there is a positive correlation between cumulative trophy count and rank, so I will perform the analysis on the effects of cumulative trophy count on the matchmaking algorithm. While this won't prove my original hypothesis, if I can still produce a statistically significant result that will show some form of rigged matchmaking and at the very least imply my original hypothesis. 

To solve the first problem, that I am limited to a small amount of battles per player, I <a href="https://en.wikipedia.org/wiki/Recursion">recursively</a> applied the API onto my opponents. This effectively resulted in a queue of players that started with just me. The program proceeds by taking the first player off this queue and using the API to get information about the battles in their recent history that were played for this challenge. After this, the program adds every teammate and opponent processed to the queue and repeats this process. Predictably, this process caused the queue to blow up exponentially giving me access to as much information as I like. 

It's important to note that this isn't actually a random sample—rather, it's <a href="https://en.wikipedia.org/wiki/Snowball_sampling">snowball sampling</a> where I recursively followed the web of matchmaking connections starting from my own battles. While this could potentially introduce bias since the algorithm might treat people at different skill-levels differently and this approach naturally centers on me, we should expect the recursive nature of the search to naturally span almost all skill levels. 

But let's consider the alternative, that this sample isn't representative of the population. In that case, a statistically significant result would be much worse, as it would imply that the game creators hate me and those I associate with in particular. That just doesn't make any sense at all. So we're going to move forward assuming that the dataset of 2,849 matches played is representative of the poplulation. 

### Analysis

You can find all the code needed to generate this dataset <a href="https://github.com/andrewjdarley/trophy-thieves">in this repo</a> and the jsons containing the dataset <a href="https://drive.google.com/drive/folders/1Y1eLFPs-AhY8aSnHI1_B4FRvPIgIN0v-?usp=sharing">here</a>.

To start I wanted to familiarize myself with the data. So I created a histogram of cumulative trophy counts among players included in the dataset. This results in a right-skewed unimodal distribution. (Bean is my gamertag)

<img src="/images/trophy_distribution.png">

My original plan was to use the absolute value of total cumulative trophy difference between the two teams as a metric for team imbalance, but after seeing this distribution I realized that wouldn't be fair to the game developers as it would be impossible to keep that close to zero considering how strongly skewed the distribution is. So I took a different approach and began to focus on relative rank. 

By relative rank, I mean this: imagine that in this match, 6 random people were added into the lobby. A player's relative rank refers to how their cumulative trophy count compares to that of the other 5 people playing. If you have a higher cumulative trophy count than everyone else, you are considered relative rank 1. 

A "fair" matchmaking algorithm in my opinion could either be random (each relative rank is no more likely to be placed on the same side with another relative rank) or adaptive (tries to include an even amount of "good players" and "bad players" on each side). Of these two, random selection provides a more definative and stronger null hypothesis. So we will proceed with the null hypothesis that states that the probability of any two players being on the same team is <b><i>independent</i></b> of their relative ranks.

We will test this against the alternative hypothesis that simply states the opposite, that the probability of any two players being on the same team is <b><i>dependent</i></b> on their relative ranks. 

To do this we will do a <a href="https://en.wikipedia.org/wiki/Chi-squared_test"> χ<sup>2</sup> test</a> of independence to determine whether the observed team compositions differ significantly from what we would expect under random assignment. 

The following chart shows the frequency in which each relative rank is placed on the same team as each other relative rank. Under truly random matchmaking, these observed frequencies should be approximately equal. As you can see though, there appears to be a trend where the top-3 are more likely to be teamed with others in the top-3 and vice versa. 

<img src="/images/chi_table.png">

There is a caveat we have to address here before moving forward with the statistical test, and that is the issue of teaming. Before a match of brawl stars you can play with a friend. Since these matches don't have the ability to be truly random we will have to throw them out. Meaning the only data we're working with is the blue data. But as you can see, the trend persists even after dropping these matches. 

<img src="/images/bs-invalid.png">

χ² tests are used to determine if there is a significant association between two categorical variables - in this case, whether a player's relative rank is associated with their teammate assignments. To perform this test we will first organize the data into a 6x5 <a href="https://en.wikipedia.org/wiki/Contingency_table">contingency table</a>. The second dimension becomes 5 once you drop yourself out, effectively redefining our scenario as "does your relative rank effect your assigned teammates relative ranks among the remaining five players?"

Here is the contingency table: Higher frequency is darker and lower is lighter. 

<img src="/images/bs-chitable.png">

Under the null hypothesis, you'd expect the distribution to look the same on each row. However upon visual inspection you see that as your relative rank increases the peak of your team distribution shifts down as well which agrees with our findings to this poing. But is it statistically significant? 

The χ<sup>2</sup> test yields a <a href="https://en.wikipedia.org/wiki/P-value">p-value</a> of &lt; 0.000001, allowing us to reject the null hypothesis and conclude with confidence that the Brawl Stars matchmaking algorithm for the free skin challenge is not random. 

### Conclusion

The statistical test alone is not enough to prove my initial claim that the matchmaking algorithm favors players of higher rank. All it shows is that there is a factor behind team-compositions beyond random chance. However, when you pair the test with the contingency table, you can see what kind of team-compositions are created due to the algorithm. 

As I mentioned previously, there are two types of matchmaking algorithms that could be considered fair. We already proved that random-selection isn't supported by the evidence. But what about trying to create an even distribution of good and bad players on each team? If this were the case we would expect the strongest correlations to be in the top right and bottom left corners of the contingency table as those would represent the 