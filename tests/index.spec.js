const { test, expect } = require('@playwright/test');

async function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

test.describe("Setup", () => {
  const random_number = Math.floor(Math.random() * 100), random_string = [(Math.random() + 1).toString(36).substring(7), (Math.random() + 1).toString(36).substring(7), (Math.random() + 1).toString(36).substring(7)]
  test.beforeEach(async ({ page }) => {
    page.goto('https://discord.com/login')

    await page.waitForURL('https://discord.com/app');
    await page.waitForURL('https://discord.com/channels/@me');
  
    await page.click('div[data-list-item-id="guildsnav___1088040109305241610"]')
    await expect(page).toHaveURL('https://discord.com/channels/1088040109305241610/1088040109909213279');
  
    await page.getByLabel('Close').click()
  });

  // test('Default', async ({ page }) => {
  //   await remove_channels(page)
  //   await setup_max_channels(3, page)
  // });

  test('Modify', async ({ page }) => {
    // config.setChannelName(`{user} ${random_number}`);
    // config.setBadWords(random_string);

    await remove_channels(page)
    await modify(page, random_number, random_string)
    await voice(page, random_number, random_string)
  });

  test('config', async ({ page }) => {
    await config(page)
    await check_config(page, random_number, random_string)
  });
});


const testedBotName = "AncientAI"


async function remove_channels (page) {
  const channels_count = await (await page.getByRole("button", { name: "➕ New Channel" })).count()
  const category_count = await (await page.getByRole("button", { name: "🌀 Dynamic Channels" })).count()
  
  if (category_count !== 0) {
    for (var i = 0; i < category_count; i++) {
      const result = await page.getByText("🌀 Dynamic Channels")

      await result.first().click({ button: 'right' })
      await page.getByText("Delete Category").click()
      await page.getByRole("button", { name: "Delete Category" }).click()
      await sleep(1000)
    }
  }


  if (channels_count !== 0) {
    for (var i = 0; i < channels_count; i++) {
      const result = await page.getByText("➕ New Channel")
      
      await result.first().click({ button: 'right' })
      await page.getByText("Delete Channel").click()
      await page.getByRole("button", { name: "Delete Channel" }).click()
      await sleep(1000)
    }
  }
}

async function setup (page) {
  await page.getByRole("textbox", { name: "Message #general" }).locator("div").click()
  await page.getByRole("textbox", { name: "Message #general" }).fill("/setup")

  await page.getByText( "Commands matching" ).locator( ".." ).locator( ".." ).locator( ".." ).getByRole('option', { name: `/setup Setting up Dynamico ${testedBotName}` }).getByText('Setting up Dynamico').click();
  await page.getByRole("textbox", { name: "Message #general" }).press("Enter")
}
async function setup_max_channels (max, page) {
  for (var i = 0; i < max; i++) {
    await setup(page)
    
    await page.getByRole('button', { name: '▶️ Next' }).click();
    await page.getByRole('button', { name: '✅ Finish' }).click();
    await page.waitForSelector('div', { name: '🛠️ Dynamico has been set up successfully!' })
  }
  
  await setup(page)
  
  await expect(page.getByRole("button", { name: '➕ New Channel' })).toHaveCount(max)
  await expect(page.getByText("Master Channels limit")).toBeVisible()
}
async function modify (page, random_number, random_string) {
  await setup(page)
    

  await page.getByRole('button', { name: '✏️ Modify Default Name' }).click();
  await page.waitForSelector('form', { name: 'Set dynamic channels name' })

  await page.getByRole("dialog").locator("input").fill(`{user} ${random_number}`)
  await page.getByRole('button', { name: 'Submit' }).click();


  await page.waitForSelector('code', { text: `{user} ${random_number}` });
  await expect(page.getByText(`{user} ${random_number}`, { exact: true })).toBeVisible();


  await page.getByRole('button', { name: '▶️ Next' }).click();
  await page.getByRole('button', { name: '◀️ Back' }).click();


  await page.waitForSelector('code', { text: `{user} ${random_number}` });
  await expect(page.getByText(`{user} ${random_number}`, { exact: true })).toBeVisible();


  await page.getByRole('button', { name: '▶️ Next' }).click();
  

  await page.getByRole('button', { name: '🙅 Modify Bad Words' }).click();
  await page.waitForSelector('form', { name: 'Set bad words' })

  await page.getByRole("dialog").locator("textarea").fill(`${random_string.join(', ')}`)
  await page.getByRole('button', { name: 'Submit' }).click();


  await page.waitForSelector('code', { text: `${random_string.join(', ')}` });
  await expect(page.getByText(`${random_string.join(', ')}`, { exact: true })).toBeVisible();


  await page.getByRole('button', { name: '◀️ Back' }).click();
  await page.getByRole('button', { name: '▶️ Next' }).click();


  await page.waitForSelector('code', { text: `${random_string.join(', ')}` });
  await expect(page.getByText(`${random_string.join(', ')}`, { exact: true })).toBeVisible();


  await page.getByRole('button', { name: '✅ Finish' }).click()

  await expect(page.getByText('Dynamico has been set up successfully!')).toBeVisible();

  await page.waitForSelector('code', { text: `{user} ${random_number}` });
  await expect(page.getByText(`{user} ${random_number}`, { exact: true })).toBeVisible();

  await page.waitForSelector('code', { text: `${random_string.join(", ")}` });
  await expect(page.getByText(`${random_string.join(", ")}`, { exact: true })).toBeVisible();
}

async function voice (page, random_number, random_string) {
  await page.getByRole("button", { name: '➕ New Channel' }).click()

  await sleep(1000)

  await expect(page.getByRole('link', { name: `GUZR ${random_number} (voice channel)` })).toBeVisible();

  const channel = await page.getByRole('link', { name: `GUZR ${random_number}` })

  await channel.first().click({ button: 'right' })
  await page.getByText("Open Chat").click()

  await page.waitForSelector('div', { name: '🌀 Manage your Dynamic Channel' })


  await rename(page, random_string);
  await sleep(1000)


  await user_limit(page);
  await sleep(1000)


  await public_channel(page);
  await sleep(1000)


  await private_channel(page, 'Gal Asraf#0001');
  await sleep(1000)


  await manage_users(page, 'Gal Asraf#0001');
}
async function rename (page, random_string) {
  for (let i = 0; i < random_string.length; i++) {
    await page.getByRole('button', { name: '✏️ Rename' }).click();
    await page.waitForSelector('form', { name: 'Rename Channel' })
  
    await page.getByRole("dialog").locator("input").fill(`${random_string[i]}`)
    await page.getByRole('button', { name: 'Submit' }).click()

    await expect(page.getByText('Failed to rename your channel')).toBeVisible()
  }

  const channel_string = (Math.random() + 1).toString(36).substring(7)
  await page.getByRole('button', { name: '✏️ Rename' }).click();
  await page.waitForSelector('form', { name: 'Rename Channel' })

  await page.getByRole("dialog").locator("input").fill(`${channel_string}`)
  await page.getByRole('button', { name: 'Submit' }).click()


  await expect(page.getByText(`Your channel's name has changed to '${channel_string}'`)).toBeVisible()
  await expect(page.getByRole('link', { name: `${channel_string} (voice channel)` })).toBeVisible();
}
async function user_limit (page) {
  await page.getByRole('button', { name: '✋ User Limit' }).click();
  await page.waitForSelector('form', { name: 'Set user limit' })

  await page.getByRole("dialog").locator("input").fill(`${btoa(+new Date).substr(-7, 5)}`)
  await page.getByRole('button', { name: 'Submit' }).click()


  await sleep(1000)
  await expect(page.getByText(`User limit must be between 0 and 99`)).toBeVisible()


  await page.getByRole('button', { name: '✋ User Limit' }).click();
  await page.waitForSelector('form', { name: 'Set user limit' })

  await page.getByRole("dialog").locator("input").fill(`-${Math.floor(Math.random() * 10)}`)
  await page.getByRole('button', { name: 'Submit' }).click()


  await sleep(1000)
  await expect(page.getByText(`User limit must be between 0 and 99`)).toBeVisible()


  const limit_random = Math.floor(Math.random() * 100)
  await page.getByRole('button', { name: '✋ User Limit' }).click();
  await page.waitForSelector('form', { name: 'Set user limit' })

  await page.getByRole("dialog").locator("input").fill(`${limit_random}`)
  await page.getByRole('button', { name: 'Submit' }).click()

  await sleep(1000)
  await expect(page.getByText(`Your channel's user limit has changed to ${limit_random}`)).toBeVisible()
}
async function public_channel (page) {
  await page.getByRole('button', { name: '🌐 Public' }).click();
  await expect(page.getByText('Your channel is public now!')).toBeVisible()
}
async function private_channel (page, username) {
  await page.getByRole('button', { name: '🚫 Private' }).click();
  await expect(page.getByText('Your channel is private now!')).toBeVisible()
  
  const add_access = await page.getByRole('combobox', { name: '☝️ Grant User Access' })
  await add_access.click();
  await add_access.fill(`${username.substring(0, username.indexOf('#'))}`)
  await page.getByText(`${username}`).press("Enter")


  await expect(page.getByText(`${username.substring(0, username.indexOf('#'))} can now connect to your channel`)).toBeVisible()


  await add_access.click();
  await add_access.fill(`${username.substring(0, username.indexOf('#'))}`)
  await page.getByText(`${username}`).press("Enter")


  await expect(page.getByText('Hmm.. nothing changed')).toBeVisible()

  await page.getByRole('button', { name: '👇 Remove User From List' }).click();
  await page.getByRole('option', { name: `👤 ${username.replace(/(#)/g, " $1")}` }).click();
}
async function manage_users (page, username) {
  await page.getByRole('button', { name: '👥 Manage Users' }).click();
  await expect(page.getByText('Manage users access for your dynamic channel')).toBeVisible()
  
  const add_access = await page.getByRole('combobox', { name: '☝️ Grant User Access' })
  await add_access.click();
  await add_access.fill(`${username.substring(0, username.indexOf('#'))}`)
  await page.getByText(`${username}`).press("Enter")

  
  await expect(page.getByText(`${username.substring(0, username.indexOf('#'))} can now connect to your channel`)).toBeVisible()


  await add_access.click();
  await add_access.fill(`${username.substring(0, username.indexOf('#'))}`)
  await page.getByText(`${username}`).press("Enter")


  await expect(page.getByText('Hmm.. nothing changed')).toBeVisible()

  await page.getByRole('button', { name: '👇 Remove User From List' }).click();
  await page.getByRole('option', { name: `👤 ${username.replace(/(#)/g, " $1")}` }).click();
}

async function config (page) {
  await page.getByRole("textbox", { name: "Message #general" }).locator("div").click()
  await page.getByRole("textbox", { name: "Message #general" }).fill("/config")

  await page.getByText( "Commands matching" ).locator( ".." ).locator( ".." ).locator( ".." ).getByRole('option', { name: `/config Configure Dynamico ${testedBotName}` }).getByText('Configure Dynamico').click();
  await page.getByRole("textbox", { name: "Message #general" }).press("Enter")
}
async function check_config (page, random_number, random_string) {
  await page.waitForSelector('code', { text: `{user} ${random_number}` });
  await expect(page.getByText(`{user} ${random_number}`, { exact: true })).toBeVisible();
  await expect(page.getByText(`${random_string.join(", ")}`, { exact: true })).toBeVisible();

  const random_number1 = Math.floor(Math.random() * 100), random_string1 = [(Math.random() + 1).toString(36).substring(7), (Math.random() + 1).toString(36).substring(7), (Math.random() + 1).toString(36).substring(7)]

  
  await master_channel(page, random_number1)


  await badwords(page, random_string1)


  await voice_config(page, random_number1, random_string1)
}
async function master_channel (page, random_number) {
  await page.getByRole('button', { name: '✏️ Master Channel #1' }).click();
  await page.waitForSelector('form', { name: 'Set dynamic channels name' })

  await page.getByRole("dialog").locator("input").fill(`{user} ${random_number}`)
  await page.getByRole('button', { name: 'Submit' }).click();

  await page.waitForSelector('code', { text: `{user} ${random_number}` });
  await expect(page.getByText(`{user} ${random_number}`, { exact: true })).toBeVisible();
}
async function badwords (page, random_string) {
  await page.getByRole('button', { name: '🙅 Modify Bad Words' }).click();
  await page.waitForSelector('form', { name: 'Set bad words' })


  await page.getByRole("dialog").locator("textarea").fill(`${random_string.join(", ")}`)
  await page.getByRole('button', { name: 'Submit' }).click();

  await page.waitForSelector('code', { text: `${random_string.join(", ")}` });
  await expect(page.getByText(`${random_string.join(", ")}`, { exact: true })).toBeVisible();
}
async function voice_config (page, random_number, random_string) {
  await page.getByRole("button", { name: '➕ New Channel' }).click()

  await sleep(1000)

  await expect(page.getByRole('link', { name: `GUZR ${random_number} (voice channel)` })).toBeVisible();

  const channel = await page.getByRole('link', { name: `GUZR ${random_number}` })

  await channel.first().click({ button: 'right' })
  await page.getByText("Open Chat").click()

  await page.waitForSelector('div', { name: '🌀 Manage your Dynamic Channel' })


  await rename(page, random_string);
}