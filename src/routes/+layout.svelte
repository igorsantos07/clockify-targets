<svelte:head>
	<link rel="shortcut icon" type="image/png" href="/favicon.png" />
</svelte:head>

<style lang="scss">
  @import "./styles/main.scss";
  @import "~/bootstrap-icons/font/bootstrap-icons";
</style>

<script>
	import { Col, Collapse, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Icon, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink, Spinner } from 'sveltestrap'
	import Auth from '$lib/Auth.js'
	import { _store } from '$data/_store.js'

	let isOpen = false
	const isAuth = new Auth().$isAuth
	const isLoading = _store.loading
	const user = _store.user
	const settings = _store.settings

	function toggle() {
		return isOpen = !isOpen
	}
</script>

<header>
	<Navbar color="dark" dark expand="sm"><!-- color prop: bg; dark/light prop: text color lol -->
		<Col>
			<!-- TODO move these to a sidebar menu, like the Clockify interface -->
			<NavbarToggler class="border-0" on:click={toggle} />
			<NavbarBrand href="/"><img src="/logo.svg" alt="Clockify Extras" /></NavbarBrand>
			<Collapse {isOpen} navbar expand="sm">
				<Nav navbar>
					<NavItem> <!--TODO-->
						<NavLink disabled={!$isAuth} href="/targets">
							<Icon name="bullseye" />
							Targets
						</NavLink>
					</NavItem>
					<NavItem> <!--TODO-->
						<NavLink disabled={true || !$isAuth} href="/periods">
							<Icon name="calendar" />
							Periods
						</NavLink>
					</NavItem>
					<NavItem> <!--TODO-->
						<NavLink disabled={true || !$isAuth} href="/settings">
							<Icon name="tools" />
							Settings
						</NavLink>
					</NavItem>

					<Dropdown nav inNavbar>
						<DropdownToggle nav caret>About</DropdownToggle>
						<DropdownMenu end>
							<DropdownItem target="_blank"
							              href="https://github.com/igorsantos07/clockify-monthly-tracker/issues">
								<Icon name="github" />
								Source code
							</DropdownItem>
							<DropdownItem target="_blank"
							              href="https://github.com/igorsantos07/clockify-monthly-tracker/issues">
								<Icon name="bug" />
								Issues
							</DropdownItem>
							<DropdownItem divider />
							<DropdownItem target="_blank" href="http://www.igorsantos.com.br">
								<Icon name="eyeglasses" />
								by @igorsantos07
							</DropdownItem>
						</DropdownMenu>
					</Dropdown>
				</Nav>
			</Collapse>
		</Col>
		<Col xs="auto">
			<Nav navbar>
				{#if !$isAuth || !$user}
					<NavItem>
						<NavLink href="/api-key">
							<Icon name="box-arrow-in-left" />
							Login
						</NavLink>
					</NavItem>
				{:else}
					<NavItem>
						<NavLink on:click={() => $settings.hideMoney = !$settings.hideMoney}>
							<Icon name={$settings.hideMoney? 'eye-slash-fill' : 'eye-fill'} />
						</NavLink>
					</NavItem>
					<Dropdown nav inNavbar id="profile">
						<DropdownToggle nav caret>
							<img src={$user.profilePicture} alt="avatar" />
						</DropdownToggle>
						<DropdownMenu end class="position-absolute"><!-- absolute forces it to float even on XS -->
							<DropdownItem header>Hi {$user.name}!</DropdownItem>
							<!--							<DropdownItem divider/>-->
							<DropdownItem href="/api-key">
								<Icon name="key" />
								API Key / log out
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
		<Spinner color="secondary" />
	</div>
{/if}

<Container fluid class="py-3 px-0 px-sm-2">
	<slot />
</Container>
