import { defineComponent } from 'vue'
import { mount, shallowMount, VueWrapper } from '../src'
import ComponentWithChildren from './components/ComponentWithChildren.vue'

describe('shallowMount', () => {
  it('renders props for stubbed component in a snapshot', () => {
    expect.addSnapshotSerializer({
      test(wrapper: VueWrapper<any>) {
        return '__app' in wrapper
      },
      serialize(wrapper: VueWrapper<any>) {
        return wrapper.html()
      }
    })

    const MyLabel = defineComponent({
      props: ['val'],
      template: '<label :for="val">{{ val }}</label>'
    })

    const Component = defineComponent({
      components: { MyLabel },
      template: '<MyLabel val="username" />',
      data() {
        return {
          foo: 'bar'
        }
      }
    })

    const wrapper = shallowMount(Component)

    expect(wrapper.html()).toBe(
      '<my-label-stub val="username"></my-label-stub>'
    )
    expect(wrapper).toMatchSnapshot()
  })

  it('stubs all components automatically using { shallow: true }', () => {
    const wrapper = mount(ComponentWithChildren, { shallow: true })
    expect(wrapper.html()).toEqual(
      '<div class="ComponentWithChildren">' +
        '<hello-stub></hello-stub>' +
        '<component-with-input-stub></component-with-input-stub>' +
        '<component-without-name-stub></component-without-name-stub>' +
        '<with-props-stub></with-props-stub>' +
        '</div>'
    )
  })

  it('stubs all components automatically using shallowMount', () => {
    const wrapper = shallowMount(ComponentWithChildren)
    expect(wrapper.html()).toEqual(
      '<div class="ComponentWithChildren">' +
        '<hello-stub></hello-stub>' +
        '<component-with-input-stub></component-with-input-stub>' +
        '<component-without-name-stub></component-without-name-stub>' +
        '<with-props-stub></with-props-stub>' +
        '</div>'
    )
  })

  it('stubs all components, but allows providing custom stub', () => {
    const wrapper = mount(ComponentWithChildren, {
      shallow: true,
      global: {
        stubs: {
          Hello: { template: '<div>Override</div>' }
        }
      }
    })
    expect(wrapper.html()).toEqual(
      '<div class="ComponentWithChildren">' +
        '<div>Override</div>' +
        '<component-with-input-stub></component-with-input-stub>' +
        '<component-without-name-stub></component-without-name-stub>' +
        '<with-props-stub></with-props-stub>' +
        '</div>'
    )
  })
})
