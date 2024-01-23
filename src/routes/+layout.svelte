<svelte:head>
	<link rel="shortcut icon" type="image/png" href="/favicon-white.png"/>

	<!-- TODO check with (future) users if we need to explictly download an emoji font) -->
	<!--	<link rel="preconnect" href="https://fonts.googleapis.com"/>-->
	<!--	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>-->
	<!--	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap"/>-->
</svelte:head>

<style>
@import "../styles/main.scss";
@import "~/bootstrap-icons/font/bootstrap-icons";
</style>

<script>
import { Col, Collapse, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Icon, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Spinner, Tooltip } from 'sveltestrap'
import Auth from '$lib/Auth'
import { _store } from '$data/_store'
import { FIREBASE_INIT } from '$data/_firebase'

FIREBASE_INIT()

let navbarOpen  = false
const isAuth    = new Auth().$isAuth
const isLoading = _store.loading
const user      = _store.user
const settings  = _store.settings

function toggleNavbar() {
	return navbarOpen = !navbarOpen
}
</script>

<header>
	<Navbar color="dark" dark expand="sm"><!-- color prop: bg; dark/light prop: text color lol -->
		<Col>
			<!-- TODO move these to a sidebar menu, like the Clockify interface -->
			<NavbarToggler class="border-0" on:click={toggleNavbar}/>
			<NavbarBrand href="/"><img src="/logo-white-32.png" alt="Clockify Targets"/></NavbarBrand>
			<Collapse isOpen={navbarOpen} navbar expand="sm">
				<Nav navbar>
					<NavItem>
						<NavLink disabled={!$isAuth} href="/targets">
							<Icon name="bullseye"/> Targets
						</NavLink>
					</NavItem>
					<!--TODO-->
					<!-- NavItem>
						<NavLink disabled={true || !$isAuth} href="/periods">
							<Icon name="calendar"/> Periods
						</NavLink>
					</NavItem-->
					<NavItem>
						<NavLink disabled={!$isAuth} href="/settings">
							<Icon name="tools"/> Settings
						</NavLink>
					</NavItem>

					<Dropdown nav inNavbar>
						<DropdownToggle nav caret>About</DropdownToggle>
						<DropdownMenu end>
							<DropdownItem target="_blank" href="https://github.com/igorsantos07/clockify-monthly-tracker">
								<Icon name="github" /> Source code
							</DropdownItem>
							<DropdownItem target="_blank" href="https://github.com/igorsantos07/clockify-monthly-tracker/issues">
								<Icon name="bug" /> Issues
							</DropdownItem>
							<DropdownItem divider/>
							<DropdownItem target="_blank" href="http://www.igorsantos.com.br">👨🏻‍💻 by @igorsantos07</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</Nav>
			</Collapse>
		</Col>
		<Col xs="auto">
			<Nav navbar id="corner-nav">
				{#if !$isAuth || !$user}
					<NavItem>
						<NavLink href="/api-key">
							<Icon name="box-arrow-in-left"/> Login
						</NavLink>
					</NavItem>
				{:else}
					<NavItem class="me-2">
						<NavLink on:click={() => $settings.hideMoney = !$settings.hideMoney} id="hideMoney" class="emoji">
							{#if $settings.hideMoney}🙈{:else}🤑{/if}
						</NavLink>
						<Tooltip target="hideMoney">Show/hide monetary values</Tooltip>
					</NavItem>

					<Dropdown nav inNavbar id="profile">
						<DropdownToggle nav caret>
							<img src={$user.profilePicture} alt="avatar"/>
						</DropdownToggle>
						<DropdownMenu end class="position-absolute"><!-- absolute forces it to float even on XS -->
							<DropdownItem header>Hi {$user.name}!</DropdownItem>
<!--							<DropdownItem divider/>-->
							<DropdownItem href="/api-key">
								<Icon name="key"/> API Key / log out
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				{/if}
			</Nav>
		</Col>
	</Navbar>
</header>

{#if $isLoading}
	<div class="modal-backdrop" id="loading">
		<Spinner color="secondary"/>
	</div>
{/if}

<main class="container-fluid pt-3 px-0 px-sm-2">
	<slot/>
</main>
