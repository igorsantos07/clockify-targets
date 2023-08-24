<style lang="scss">
@import "./styles.scss";
@import "../../node_modules/bootstrap-icons/font/bootstrap-icons";
</style>

<script>
import { Collapse, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Icon, Nav, Navbar, NavbarToggler, NavItem, NavLink } from 'sveltestrap'
import Auth from '$lib/Auth.js'

const isAuth = new Auth().$isAuth
let isOpen = false

function toggle() {
	return isOpen = !isOpen
}
</script>

<!-- color prop = bg; dark/light prop = text color...... lol -->
<header>
	<Navbar color="dark" dark expand="sm">
		<!-- TODO move these to a sidebar menu, like the Clockify interface -->
		<NavbarToggler class="border-0" on:click={toggle}/>
		<Collapse {isOpen} navbar expand="sm">
			<Nav navbar>
				<NavItem>
					<NavLink disabled={!$isAuth} href="/settings"><Icon name="tools"/>Settings</NavLink> <!-- TODO -->
				</NavItem>
				<NavItem>
					<NavLink disabled={!$isAuth} href="/targets"><Icon name="bullseye"/>Targets</NavLink> <!-- TODO -->
				</NavItem>
				<NavItem>
					<NavLink disabled={!$isAuth} href="/periods"><Icon name="calendar"/>Periods</NavLink>  <!-- TODO -->
				</NavItem>

				{#if !$isAuth}
					<NavItem>
						<NavLink href="/login"><Icon name="box-arrow-in-left"/>Login</NavLink>
					</NavItem>
				{:else}
					<NavItem>
						<NavLink href="/login"><Icon name="key"/>API Key</NavLink>
					</NavItem>
				{/if}

				<Dropdown nav inNavbar>
					<DropdownToggle nav caret>About</DropdownToggle>
					<DropdownMenu end>
						<DropdownItem target="_blank" href="https://github.com/igorsantos07/clockify-monthly-tracker/issues"><Icon name="github"/>Source code</DropdownItem>
						<DropdownItem target="_blank" href="https://github.com/igorsantos07/clockify-monthly-tracker/issues"><Icon name="bug"/>Issues</DropdownItem>
						<DropdownItem divider/>
						<DropdownItem target="_blank" href="http://www.igorsantos.com.br"><Icon name="eyeglasses"/>by @igorsantos07</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</Nav>
		</Collapse>
	</Navbar>
</header>

<Container fluid class="py-3 px-0 px-sm-2">
	<slot/>
</Container>
